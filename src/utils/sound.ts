/**
 * Sound System for FinanceQuest Campus Edition
 * Manages all audio playback with volume control and state management
 */

// Import audio files as Vite assets with ?url suffix to get the asset URL
import buttonClickSound from '../public/button-click-sound.mp3?url';
import hoverSound from '../public/hover-button-sound.mp3?url';
import levelUpSound from '../public/level-up-sound.mp3?url';
import questCompleteSound from '../public/quest-complete-sound.mp3?url';
import badgeSound from '../public/badge-sound.mp3?url';
import coinsSound from '../public/coins-sound.mp3?url';
import backgroundMusic from '../public/glowingtides-background-music.MP3?url';

export type SoundType = 
  | 'button-click'
  | 'hover'
  | 'level-up'
  | 'quest-complete'
  | 'badge-earned'
  | 'coins'
  | 'background-music';

export interface SoundSettings {
  masterVolume: number; // 0-1
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number; // 0-1
  musicVolume: number; // 0-1
}

// Sound file paths - Using imported Vite assets
const SOUND_PATHS: Record<SoundType, string> = {
  'button-click': buttonClickSound,
  'hover': hoverSound,
  'level-up': levelUpSound,
  'quest-complete': questCompleteSound,
  'badge-earned': badgeSound,
  'coins': coinsSound,
  'background-music': backgroundMusic
};

// Debug: Log the resolved asset URLs
console.log('🎵 Sound asset URLs:', SOUND_PATHS);

// Audio instances cache
const audioInstances: Partial<Record<SoundType, HTMLAudioElement>> = {};
let backgroundMusicInstance: HTMLAudioElement | null = null;
let backgroundMusicTimeout: NodeJS.Timeout | null = null;

/**
 * Initialize an audio instance
 */
const createAudioInstance = (type: SoundType): HTMLAudioElement => {
  const path = SOUND_PATHS[type];
  const audio = new Audio();
  
  // Add error handler before setting source
  audio.addEventListener('error', (e) => {
    console.error(`Failed to load audio file for ${type}:`, path, e);
  });
  
  audio.src = path;
  
  if (type === 'background-music') {
    audio.loop = false; // We'll handle loop manually with 3s delay
    audio.preload = 'auto';
  } else {
    audio.preload = 'auto';
  }
  
  // Attempt to load the audio
  audio.load();
  
  return audio;
};

/**
 * Get or create audio instance
 */
const getAudioInstance = (type: SoundType): HTMLAudioElement => {
  if (type === 'background-music') {
    if (!backgroundMusicInstance) {
      backgroundMusicInstance = createAudioInstance(type);
      setupBackgroundMusicLoop();
    }
    return backgroundMusicInstance;
  }

  if (!audioInstances[type]) {
    audioInstances[type] = createAudioInstance(type);
  }
  return audioInstances[type]!;
};

/**
 * Setup background music loop with 3-second delay
 */
const setupBackgroundMusicLoop = () => {
  if (!backgroundMusicInstance) return;

  backgroundMusicInstance.addEventListener('ended', () => {
    // Clear any existing timeout
    if (backgroundMusicTimeout) {
      clearTimeout(backgroundMusicTimeout);
    }

    // Wait 3 seconds before replaying
    backgroundMusicTimeout = setTimeout(() => {
      if (backgroundMusicInstance) {
        backgroundMusicInstance.currentTime = 0;
        backgroundMusicInstance.play().catch(err => {
          console.warn('Failed to replay background music:', err);
        });
      }
    }, 3000);
  });
};

/**
 * Play a sound effect
 */
export const playSound = (
  type: Exclude<SoundType, 'background-music'>,
  settings: SoundSettings
): void => {
  if (!settings.sfxEnabled || settings.masterVolume === 0) return;

  try {
    const audio = getAudioInstance(type);
    
    // Check if audio source is loaded
    if (!audio.src || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      console.warn(`Sound ${type} has no source:`, audio.src);
      return;
    }
    
    audio.volume = settings.masterVolume * settings.sfxVolume;
    
    // Clone the audio to allow multiple simultaneous plays
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = audio.volume;
    
    clone.play().catch(err => {
      // Silently fail on autoplay restrictions (first interaction)
      if (err.name !== 'NotAllowedError') {
        console.warn(`Failed to play sound: ${type}`, err);
      }
    });
  } catch (error) {
    console.warn(`Error playing sound: ${type}`, error);
  }
};

/**
 * Play background music
 */
export const playBackgroundMusic = (settings: SoundSettings): void => {
  if (!settings.musicEnabled || settings.masterVolume === 0) {
    stopBackgroundMusic();
    return;
  }

  try {
    const audio = getAudioInstance('background-music');
    audio.volume = settings.masterVolume * settings.musicVolume;
    
    if (audio.paused) {
      audio.play().catch(err => {
        console.warn('Failed to play background music:', err);
      });
    }
  } catch (error) {
    console.warn('Error playing background music:', error);
  }
};

/**
 * Stop background music
 */
export const stopBackgroundMusic = (): void => {
  if (backgroundMusicInstance) {
    backgroundMusicInstance.pause();
    backgroundMusicInstance.currentTime = 0;
  }

  if (backgroundMusicTimeout) {
    clearTimeout(backgroundMusicTimeout);
    backgroundMusicTimeout = null;
  }
};

/**
 * Update background music volume
 */
export const updateBackgroundMusicVolume = (settings: SoundSettings): void => {
  if (backgroundMusicInstance) {
    backgroundMusicInstance.volume = settings.masterVolume * settings.musicVolume;
  }
};

/**
 * Update all sound volumes
 */
export const updateSoundVolumes = (settings: SoundSettings): void => {
  // Update background music
  updateBackgroundMusicVolume(settings);

  // Update SFX volumes (they'll use the new settings on next play)
  Object.entries(audioInstances).forEach(([type, audio]) => {
    if (audio && type !== 'background-music') {
      audio.volume = settings.masterVolume * settings.sfxVolume;
    }
  });
};

/**
 * Preload all sounds for better performance
 */
export const preloadSounds = (): void => {
  console.log('Preloading sounds from:', Object.values(SOUND_PATHS));
  Object.keys(SOUND_PATHS).forEach(type => {
    try {
      const audio = getAudioInstance(type as SoundType);
      console.log(`Preloaded ${type}:`, audio.src, 'Ready state:', audio.readyState);
    } catch (err) {
      console.error(`Failed to preload ${type}:`, err);
    }
  });
};

/**
 * Cleanup all audio instances (call on unmount)
 */
export const cleanupSounds = (): void => {
  stopBackgroundMusic();
  
  Object.values(audioInstances).forEach(audio => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
  });

  if (backgroundMusicInstance) {
    backgroundMusicInstance.pause();
    backgroundMusicInstance.src = '';
    backgroundMusicInstance = null;
  }
};

/**
 * Default sound settings
 */
export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  masterVolume: 0.7,
  sfxEnabled: true,
  musicEnabled: false,
  sfxVolume: 0.8,
  musicVolume: 0.5
};
