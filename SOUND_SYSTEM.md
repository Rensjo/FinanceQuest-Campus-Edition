# 🔊 Sound System Implementation

## Overview

FinanceQuest Campus Edition now features a comprehensive sound system that enhances user experience with audio feedback for various interactions and events. The system includes:

- Background music with intelligent looping
- Sound effects for all major interactions
- Granular volume controls
- Master mute functionality
- Performance-optimized audio playback

---

## 🎵 Available Sounds

### Sound Effects (SFX)

| Sound | File | Trigger |
|-------|------|---------|
| **Button Click** | `button-click-sound.mp3` | Any button click, envelope/goal edits, modal confirmations |
| **Hover** | `hover-button-sound.mp3` | Mouse enter on buttons, cards, and interactive elements |
| **Level Up** | `level-up-sound.mp3` | Player reaches a new level |
| **Quest Complete** | `quest-complete-sound.mp3` | Daily or achievement quest completed, streak maintained |
| **Badge Earned** | `badge-sound.mp3` | New badge unlocked |
| **Coins** | `coins-sound.mp3` | Transaction added (expense/income/transfer) |

### Background Music

| Sound | File | Details |
|-------|------|---------|
| **BGM** | `glowingtides-background-music.MP3` | Ambient music that loops with 3-second delay between plays |

---

## 🛠️ Technical Architecture

### Core Files

#### **`src/utils/sound.ts`**
Central sound management system with:
- Audio instance caching for performance
- Volume management (master, SFX, music)
- Background music loop with 3s delay
- Preloading for instant playback
- Cleanup functions for memory management

#### **`src/hooks/useSound.ts`**
React hooks for easy sound integration:
- `useSoundSystem()` - Full sound system with background music
- `useSound(type)` - Individual sound effect hook

#### **`src/types.ts`**
Extended `UserPrefs` interface with sound settings:
```typescript
soundSettings: {
  masterVolume: number;    // 0-1
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;       // 0-1
  musicVolume: number;     // 0-1
}
```

---

## 🎮 User Controls

### Settings Panel (Enhanced)

Users can control audio through the Settings panel:

1. **Master Volume Slider**
   - Controls overall volume (0-100%)
   - Affects both SFX and music
   - Visual feedback with VolumeX icon at 0%

2. **Background Music Toggle**
   - Enable/disable ambient music
   - Expandable volume slider when enabled
   - Automatic 3-second delay loop

3. **Sound Effects Toggle**
   - Enable/disable all SFX
   - Expandable volume slider when enabled
   - Test buttons for preview:
     - Test Click
     - Test Coins
     - Test Level Up

4. **Visual Enhancements**
   - Animated toggle switches
   - Color-coded sliders (cyan for master, purple for music, green for SFX)
   - Real-time percentage display

---

## 🎯 Integration Points

### App.tsx
- Background music management
- Transaction notifications (coins sound)
- Level up notifications
- Badge earned notifications
- Quest completion notifications
- Global hover sound listener

### Dashboard.tsx
- Button click sounds for:
  - Status panel
  - Badges panel
  - Shop panel
  - Settings panel
  - Add envelope
  - Edit envelope
  - Delete envelope
  - Add goal
  - Edit goal
  - Delete goal

### SettingsPanel.tsx
- Sound settings UI
- Real-time volume adjustment
- Test buttons for SFX preview
- Toggle switches with sound feedback

---

## 🎨 Custom Styling

### Range Sliders (`src/index.css`)

```css
/* Master Volume Slider */
input[type="range"].slider {
  /* Cyan gradient thumb */
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

/* SFX/Music Volume Sliders */
input[type="range"].slider-small {
  /* Green gradient thumb */
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
```

---

## 🔧 API Reference

### `playSound(type, settings)`
Play a sound effect once.

```typescript
import { playSound } from '../utils/sound';

playSound('button-click', soundSettings);
```

### `playBackgroundMusic(settings)`
Start background music with loop.

```typescript
import { playBackgroundMusic } from '../utils/sound';

playBackgroundMusic(soundSettings);
```

### `stopBackgroundMusic()`
Stop and reset background music.

```typescript
import { stopBackgroundMusic } from '../utils/sound';

stopBackgroundMusic();
```

### `useSoundSystem()`
Hook with automatic background music management.

```typescript
import { useSoundSystem } from '../hooks/useSound';

function MyComponent() {
  const { playSFX, settings } = useSoundSystem();
  
  return (
    <button onClick={() => playSFX('button-click')}>
      Click Me
    </button>
  );
}
```

### `useSound(type)`
Hook for individual sound effects.

```typescript
import { useSound } from '../hooks/useSound';

function MyButton() {
  const playClick = useSound('button-click');
  
  return <button onClick={playClick}>Click Me</button>;
}
```

---

## 🎼 Background Music Loop Logic

The background music system uses a custom loop with delay:

1. Music plays normally
2. When `ended` event fires:
   - Wait 3 seconds (setTimeout)
   - Reset audio to start (`currentTime = 0`)
   - Play again
3. Repeat

**Why not native loop?**
- Native `loop` attribute has no delay option
- 3-second gap prevents audio fatigue
- Creates ambient atmosphere without being intrusive

---

## ⚡ Performance Optimizations

### Audio Instance Caching
- Sound files loaded once and reused
- Prevents redundant network requests
- Instant playback after preload

### Preloading Strategy
```typescript
preloadSounds(); // Called on app mount
```
All sounds loaded during initial render for zero-latency playback.

### Memory Management
```typescript
cleanupSounds(); // Called on app unmount
```
Releases audio instances and clears event listeners.

### Volume Updates
Volume changes applied immediately without reloading audio:
```typescript
audio.volume = masterVolume * sfxVolume;
```

---

## 🎵 Default Settings

```typescript
{
  masterVolume: 0.7,    // 70%
  sfxEnabled: true,
  musicEnabled: false,   // Off by default to prevent surprise
  sfxVolume: 0.8,       // 80%
  musicVolume: 0.5      // 50%
}
```

**Why music off by default?**
- Respects user's environment
- Prevents unexpected audio
- User explicitly opts in

---

## 🐛 Troubleshooting

### Sounds Not Playing

1. **Check Settings**
   - Master volume > 0?
   - SFX enabled?
   - Browser not muted?

2. **Check Browser Console**
   - Look for "Failed to play sound" warnings
   - May indicate file loading issues

3. **Browser Autoplay Policy**
   - Some browsers block audio until user interaction
   - First click may not produce sound

### Background Music Not Looping

1. **Check Music Enabled**
   - Toggle should be ON (green)
   
2. **Check Volume**
   - Master and Music volume > 0

3. **Console Warnings**
   - "Failed to replay background music" may indicate playback restrictions

### Performance Issues

1. **Reduce Master Volume**
   - Lower volume = less CPU for audio processing

2. **Disable Hover Sounds**
   - Comment out hover listener in App.tsx if needed

3. **Disable Background Music**
   - Music is most CPU-intensive

---

## 📝 Change Log

### v2.2.0 - Sound System Release

**Added:**
- Comprehensive sound system with 7 sound files
- Background music with 3-second loop delay
- Granular volume controls (master, SFX, music)
- React hooks for easy integration
- Global hover sound listener
- Sound settings UI in Settings panel
- Test buttons for SFX preview
- Custom styled range sliders
- Audio instance caching
- Memory cleanup functions

**Updated:**
- UserPrefs interface with soundSettings
- seed.ts with default sound preferences
- App.tsx with sound integration
- Dashboard.tsx with button click sounds
- SettingsPanel.tsx with audio controls
- index.css with slider styles

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Multiple BGM tracks with playlist
- [ ] Sound themes (retro, futuristic, minimal)
- [ ] Notification sound customization
- [ ] Volume fade-in/fade-out
- [ ] Spatial audio for UI elements
- [ ] Haptic feedback on mobile
- [ ] Achievement fanfare sounds
- [ ] Quest type-specific sounds
- [ ] Transaction amount-based sounds (small vs large)

### Under Consideration
- Custom sound upload
- Sound pack marketplace
- Audio visualizer
- Voice narration option
- Screen reader integration

---

## 💡 Best Practices

### For Developers

1. **Always use hooks**
   ```typescript
   // ✅ Good
   const playSFX = useSoundSystem().playSFX;
   
   // ❌ Avoid
   import { playSound } from '../utils/sound';
   ```

2. **Avoid sound spam**
   ```typescript
   // ✅ Good - One sound per action
   onClick={() => { playSFX('button-click'); doAction(); }}
   
   // ❌ Avoid - Multiple sounds for same action
   onClick={() => { playSFX('button-click'); playSFX('hover'); doAction(); }}
   ```

3. **Respect user settings**
   ```typescript
   // ✅ Good - Settings checked automatically
   playSFX('button-click'); // Won't play if disabled
   
   // ❌ Avoid - Force play bypassing settings
   audio.play();
   ```

4. **Test with sound off**
   - App should be fully functional without sound
   - Sound is enhancement, not requirement

### For Users

1. **Start with defaults**
   - Adjust only if needed
   - Test buttons provide preview

2. **Consider environment**
   - Public space? Lower volume or disable
   - Private? Enjoy full experience

3. **Use master volume for quick mute**
   - Faster than toggling individual settings
   - Preserves relative volume levels

---

## 📚 Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [HTML Audio Element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Browser Autoplay Policies](https://developer.chrome.com/blog/autoplay/)

---

**Made with 🔊 by RenKai Studios**  
*Enhancing user experience, one sound at a time.*
