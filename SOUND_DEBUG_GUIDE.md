# 🔍 Sound System Debug Guide

## 🧪 How to Debug Sound Issues

### Step 1: Open Browser Console
1. Open your app at **http://localhost:5174/**
2. Press **F12** or **Right-click → Inspect**
3. Go to **Console** tab

### Step 2: Check Initialization Logs

When the page loads, you should see:
```
🎵 Sound System Initialized
📁 Audio Enabled: true
📁 Sound Paths: {button-click: "/assets/button-click-...", ...}
🔊 Master Volume: 0.7
🔊 SFX Volume: 0.7
🔊 Final SFX Volume: 0.49
```

**If you don't see this:**
- The hook isn't being called
- Check if App.tsx imports and uses useSoundEffects

### Step 3: Check Audio Loading

You should see messages like:
```
✅ Loaded: button-click from /assets/button-click-abc123.mp3
✅ Loaded: hover from /assets/hover-button-abc123.mp3
...
```

**If you see ❌ errors:**
- Audio files failed to load
- Check the error message for details
- Verify files exist in src/public/

### Step 4: Test Sound Playback

1. **Click anywhere on the page** (satisfies autoplay policy)
2. **Click any button** or **hover over buttons**

You should see:
```
🔊 playSound called: button-click {audioEnabled: true, isMounted: true}
▶️ Playing button-click at volume 0.49
✅ Successfully played button-click
```

**If you see:**
```
⚠️ Audio disabled, skipping button-click
```
- Go to Settings → Enable "Sound Effects"

**If you see:**
```
🔒 Autoplay blocked for button-click (expected on first load)
```
- **This is normal!** Click anywhere first to unlock audio

**If you see:**
```
❌ Failed to play sound button-click: [error]
```
- Check the error message
- Might be volume issue or file corruption

### Step 5: Check Settings Panel

Open Settings (gear icon) and check:

1. **Master Volume** - Should show percentage (0-100%)
2. **Sound Effects toggle** - Should be ON (green)
3. **Background Music toggle** - Try toggling ON
4. **Test buttons:**
   - Click "Test Click"
   - Click "Test Coins"
   - Click "Test Level Up"

Each should log:
```
🔊 playSound called: button-click
▶️ Playing button-click at volume 0.49
✅ Successfully played button-click
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Audio Enabled: false"
**Solution:** 
- Go to Settings
- Find "Sound Effects" toggle
- Turn it ON (should turn green)

### Issue 2: "❌ Failed to load: [file]"
**Solution:**
- Check that files exist in `src/public/`
- Run: `dir src\public` in terminal
- Restart dev server: Stop terminal (Ctrl+C), run `npm run dev`

### Issue 3: "Final SFX Volume: 0"
**Solution:**
- Master Volume or SFX Volume is at 0%
- Go to Settings
- Drag Master Volume slider to 50-70%
- Drag SFX Volume slider to 70-80%

### Issue 4: No logs at all
**Solution:**
- Hook not initialized
- Check if `useSoundEffects()` is called in App.tsx
- Check browser console for React errors

### Issue 5: "🔒 Autoplay blocked"
**Solution:**
- **This is normal!** Browser policy
- Click anywhere on the page once
- Then sounds will work

### Issue 6: Sounds work in Settings but not elsewhere
**Solution:**
- Check if global click/hover handlers are set up in App.tsx
- Look for `useEffect` with `document.addEventListener('click', ...)`

---

## 📋 Checklist

After checking the console, report:

- [ ] Did you see "🎵 Sound System Initialized"?
- [ ] What does "Audio Enabled" say? (true/false)
- [ ] Did you see "✅ Loaded" messages for all sounds?
- [ ] What is "Final SFX Volume"? (should be > 0)
- [ ] When you click a button, do you see "🔊 playSound called"?
- [ ] Do you see "✅ Successfully played" or an error?
- [ ] Did you click anywhere first to unlock autoplay?

---

## 🎯 Quick Fix Steps

1. **Refresh page** (Ctrl+F5) - Clear cache
2. **Click anywhere** - Unlock autoplay
3. **Open Settings** - Check toggles are ON
4. **Adjust Master Volume** - Set to 50-70%
5. **Click "Test Click" button** - Should hear sound
6. **Check console** - Look for error messages

---

## 📊 Expected Console Output (Good)

```
🎵 Sound System Initialized
📁 Audio Enabled: true
📁 Sound Paths: {button-click: "/assets/button-click-...", hover: "/assets/hover-..."}
🔊 Master Volume: 0.7
🔊 SFX Volume: 0.7
🔊 Final SFX Volume: 0.49

✅ Loaded: button-click from /assets/button-click-abc123.mp3
✅ Loaded: hover from /assets/hover-abc123.mp3
✅ Loaded: level-up from /assets/level-up-abc123.mp3
✅ Loaded: quest-complete from /assets/quest-complete-abc123.mp3
✅ Loaded: badge-earned from /assets/badge-abc123.mp3
✅ Loaded: coins from /assets/coins-abc123.mp3

[User clicks a button]

🔊 playSound called: button-click {audioEnabled: true, isMounted: true}
▶️ Playing button-click at volume 0.49
✅ Successfully played button-click
```

---

**Copy the console output and share it so I can see what's happening!** 📋
