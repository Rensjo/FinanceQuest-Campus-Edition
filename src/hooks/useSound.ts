/**
 * React Hook for Sound System Integration
 * Provides easy access to sound playback with automatic settings management
 */

import { useEffect, useCallback } from 'react';
import { useBudget } from '../store/budget';
import {
  playSound,
  playBackgroundMusic,
  stopBackgroundMusic,
  updateSoundVolumes,
  preloadSounds,
  cleanupSounds,
  DEFAULT_SOUND_SETTINGS,
  type SoundType
} from '../utils/sound';

export const useSoundSystem = () => {
  const prefs = useBudget(state => state.prefs);
  const updateSoundSettings = useBudget(state => state.updateSoundSettings);
  
  // Ensure soundSettings exist with defaults
  const soundSettings = prefs?.soundSettings || DEFAULT_SOUND_SETTINGS;
  
  // Initialize sound settings if they don't exist
  useEffect(() => {
    if (!prefs?.soundSettings) {
      updateSoundSettings(DEFAULT_SOUND_SETTINGS);
    }
  }, [prefs, updateSoundSettings]);

  // Preload sounds on mount
  useEffect(() => {
    preloadSounds();
    return () => {
      cleanupSounds();
    };
  }, []);

  // Update volumes when settings change
  useEffect(() => {
    updateSoundVolumes(soundSettings);
  }, [soundSettings]);

  // Handle background music
  useEffect(() => {
    if (soundSettings.musicEnabled && soundSettings.masterVolume > 0) {
      playBackgroundMusic(soundSettings);
    } else {
      stopBackgroundMusic();
    }
  }, [soundSettings.musicEnabled, soundSettings.masterVolume, soundSettings.musicVolume]);

  // Play sound effect function
  const playSFX = useCallback((type: Exclude<SoundType, 'background-music'>) => {
    playSound(type, soundSettings);
  }, [soundSettings]);

  return {
    playSFX,
    settings: soundSettings
  };
};

/**
 * Hook for individual sound effects (for specific components)
 */
export const useSound = (type: Exclude<SoundType, 'background-music'>) => {
  const soundSettings = useBudget(state => state.prefs.soundSettings) || DEFAULT_SOUND_SETTINGS;
  
  const play = useCallback(() => {
    playSound(type, soundSettings);
  }, [type, soundSettings]);

  return play;
};
