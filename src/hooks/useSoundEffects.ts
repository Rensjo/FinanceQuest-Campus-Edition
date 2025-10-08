import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useBudget } from '../store/budget';

// Import audio files from public folder (served by Vite)
const buttonClickSound = '/button-click-sound.mp3';
const hoverSound = '/hover-button-sound.mp3';
const levelUpSound = '/level-up-sound.mp3';
const questCompleteSound = '/quest-complete-sound.mp3';
const badgeSound = '/badge-sound.mp3';
const coinsSound = '/coins-sound.mp3';
const backgroundMusic = '/glowingtides-background-music.MP3';

export type SoundEffect = 
  | 'button-click'
  | 'hover'
  | 'level-up'
  | 'quest-complete'
  | 'badge-earned'
  | 'coins'
  | 'background-music';

interface AudioCache {
  [key: string]: HTMLAudioElement;
}

export const useSoundEffects = () => {
  // Optimize: Only subscribe to soundSettings to prevent unnecessary re-renders
  const soundSettings = useBudget(state => state.prefs?.soundSettings, (a, b) => {
    // Custom equality check - only re-render if actual settings change
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      a.masterVolume === b.masterVolume &&
      a.sfxEnabled === b.sfxEnabled &&
      a.musicEnabled === b.musicEnabled &&
      a.sfxVolume === b.sfxVolume &&
      a.musicVolume === b.musicVolume
    );
  });
  
  const audioCache = useRef<AudioCache>({});
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get settings with defaults - memoized to prevent recalculation
  const sfxEnabled = soundSettings?.sfxEnabled ?? true;
  const musicEnabled = soundSettings?.musicEnabled ?? false;
  const soundEffectsVolume = (soundSettings?.masterVolume ?? 0.7) * (soundSettings?.sfxVolume ?? 0.7);
  const backgroundMusicVolume = (soundSettings?.masterVolume ?? 0.7) * (soundSettings?.musicVolume ?? 0.5);

  // Sound file paths mapping - using imported Vite assets
  const soundPaths: Record<SoundEffect, string> = {
    'button-click': buttonClickSound,
    'hover': hoverSound,
    'level-up': levelUpSound,
    'quest-complete': questCompleteSound,
    'badge-earned': badgeSound,
    'coins': coinsSound,
    'background-music': backgroundMusic,
  };

  // Debug: Log imported asset URLs on mount (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🎵 Sound System Initialized');
      console.log('📁 SFX Enabled:', sfxEnabled);
      console.log('📁 Music Enabled:', musicEnabled);
      console.log('📁 Sound Paths:', soundPaths);
      console.log('🔊 Master Volume:', soundSettings?.masterVolume);
      console.log('🔊 SFX Volume:', soundSettings?.sfxVolume);
      console.log('🔊 Music Volume:', soundSettings?.musicVolume);
      console.log('🔊 Final SFX Volume:', soundEffectsVolume);
      console.log('🔊 Final Music Volume:', backgroundMusicVolume);
    }
  }, []);

  // Preload audio files
  const preloadAudio = useCallback((soundEffect: SoundEffect) => {
    if (!audioCache.current[soundEffect]) {
      const audio = new Audio(soundPaths[soundEffect]);
      audio.preload = 'auto';
      
      // Only log errors in development
      if (import.meta.env.DEV) {
        audio.addEventListener('error', (e) => {
          console.error(`❌ Failed to load: ${soundEffect}`, e);
        });
      }
      
      audioCache.current[soundEffect] = audio;
    }
  }, [soundPaths]);

  // Initialize audio cache
  useEffect(() => {
    if (sfxEnabled) {
      // Preload all sound effects except background music
      Object.keys(soundPaths).forEach((key) => {
        if (key !== 'background-music') {
          preloadAudio(key as SoundEffect);
        }
      });
    }
  }, [sfxEnabled, preloadAudio, soundPaths]);

  // Play sound effect
  const playSound = useCallback(
    (soundEffect: SoundEffect) => {
      if (!sfxEnabled || !isMountedRef.current) return;

      try {
        // Don't play background music through this function
        if (soundEffect === 'background-music') return;

        let audio = audioCache.current[soundEffect];
        
        // Create audio if not cached
        if (!audio) {
          audio = new Audio(soundPaths[soundEffect]);
          audioCache.current[soundEffect] = audio;
        }

        // Clone audio for simultaneous playback
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = soundEffectsVolume;
        
        const playPromise = clone.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Silently ignore autoplay and common errors
            if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
              if (import.meta.env.DEV) {
                console.warn(`Failed to play sound ${soundEffect}:`, error);
              }
            }
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(`Error playing sound ${soundEffect}:`, error);
        }
      }
    },
    [sfxEnabled, soundEffectsVolume, soundPaths]
  );

  // Setup background music loop with 3-second delay
  const setupBackgroundMusicLoop = useCallback(() => {
    if (!bgMusicRef.current) return;

    const handleEnded = () => {
      // Clear any existing timeout
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }

      // Wait 3 seconds before replaying
      loopTimeoutRef.current = setTimeout(() => {
        if (bgMusicRef.current) {
          bgMusicRef.current.currentTime = 0;
          bgMusicRef.current.play().catch(() => {}); // Silent catch
        }
      }, 3000);
    };

    bgMusicRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      bgMusicRef.current?.removeEventListener('ended', handleEnded);
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }
    };
  }, []); // No dependencies - uses refs only

  // Background music controls
  const playBackgroundMusic = useCallback(() => {
    if (!musicEnabled) return;

    try {
      // CRITICAL: Prevent multiple instances - check if already playing
      if (bgMusicRef.current) {
        if (!bgMusicRef.current.paused) {
          // Already playing, do nothing
          return;
        }
        // Paused but exists, just resume
        bgMusicRef.current.play().catch(() => {});
        return;
      }

      // Create new audio instance only if none exists
      bgMusicRef.current = new Audio(soundPaths['background-music']);
      bgMusicRef.current.loop = false; // We handle loop manually
      bgMusicRef.current.volume = backgroundMusicVolume;
      setupBackgroundMusicLoop();
      
      if (import.meta.env.DEV) {
        console.log('🎵 Background music initialized');
      }

      const playPromise = bgMusicRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {}); // Silent catch
      }
    } catch (error) {
      // Silent catch
    }
  }, [musicEnabled, backgroundMusicVolume, soundPaths, setupBackgroundMusicLoop]);

  const pauseBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
  }, []);

  // Update background music volume
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = backgroundMusicVolume;
    }
  }, [backgroundMusicVolume]);

  // Handle background music enable/disable
  useEffect(() => {
    if (musicEnabled) {
      // Only play if not already playing
      if (!bgMusicRef.current || bgMusicRef.current.paused) {
        playBackgroundMusic();
      }
    } else {
      pauseBackgroundMusic();
    }

    return () => {
      // Don't pause on cleanup if music is enabled (prevents stopping when effect re-runs)
      if (!musicEnabled) {
        pauseBackgroundMusic();
      }
    };
  }, [musicEnabled]); // Removed playBackgroundMusic and pauseBackgroundMusic from deps to prevent re-runs

  // Cleanup on unmount
  useEffect(() => {
    // Set mounted flag to true on mount
    isMountedRef.current = true;
    
    if (import.meta.env.DEV) {
      console.log('✅ Sound system mounted');
    }
    
    return () => {
      if (import.meta.env.DEV) {
        console.log('🛑 Sound system unmounting');
      }
      isMountedRef.current = false;
      
      // Stop and cleanup background music
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.src = '';
        bgMusicRef.current = null;
      }

      // Clear loop timeout
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current);
      }

      // Cleanup all cached audio
      Object.values(audioCache.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current = {};
    };
  }, []);

  // Memoize return object to prevent unnecessary re-renders in consuming components
  return useMemo(() => ({
    playSound,
    playBackgroundMusic,
    pauseBackgroundMusic,
    stopBackgroundMusic,
  }), [playSound, playBackgroundMusic, pauseBackgroundMusic, stopBackgroundMusic]);
};

export default useSoundEffects;
