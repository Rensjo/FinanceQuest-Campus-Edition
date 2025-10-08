# FinanceQuest Campus Edition - macOS Installation Guide

## 📦 Package Contents

This package contains:
- **DMG Installer** - macOS disk image with app bundle
- **Installation Guide** - This file
- **License** - MIT License

---

## 🚀 Installation Steps

### Standard Installation

1. **Open the DMG file**: `FinanceQuest_0.1.0_universal.dmg`
2. **Drag FinanceQuest.app** to the Applications folder
3. **Eject the DMG** (right-click → Eject)
4. **Launch** from Applications or Launchpad

**Installation Location**: `/Applications/FinanceQuest.app`

---

## ⚠️ macOS Security (First Launch)

macOS will block the app on first launch because it's not code-signed by Apple.

### Method 1: Control-Click Method
1. **Control-click** (or right-click) the app in Applications
2. Click **"Open"**
3. Click **"Open"** again in the dialog
4. App will now launch normally

### Method 2: Security Settings
1. Try to open the app normally (it will be blocked)
2. Go to **System Settings** → **Privacy & Security**
3. Click **"Open Anyway"** next to the FinanceQuest message
4. Click **"Open"** in the confirmation dialog

**Note**: You only need to do this once. Future launches will work normally.

---

## 🍎 Universal Binary

This build supports:
- ✅ **Apple Silicon** (M1, M2, M3, M4 chips)
- ✅ **Intel Macs** (x86_64)

The same app works on both architectures!

---

## 🔧 System Requirements

- **OS**: macOS 10.13 (High Sierra) or later
- **RAM**: 4 GB minimum
- **Disk Space**: 150 MB
- **Display**: 1024x768 minimum resolution

---

## 🎮 First Launch

1. **Launch FinanceQuest** from Applications
2. **Set your monthly budget** (optional - can skip)
3. **Start tracking expenses** immediately!

---

## 🔄 Updating

1. Download the latest DMG
2. **Quit FinanceQuest** if running
3. **Drag the new app** to Applications (replace existing)
4. Your data is preserved automatically

**Data Location**: `~/Library/Application Support/app.renkaistudios.financequest/`

---

## 🗑️ Uninstalling

1. **Quit FinanceQuest** if running
2. **Drag FinanceQuest.app** from Applications to Trash
3. **Optional**: Remove data folder:
   ```bash
   rm -rf ~/Library/Application\ Support/app.renkaistudios.financequest/
   ```

---

## 🐛 Troubleshooting

### "FinanceQuest.app is damaged and can't be opened"
This is macOS Gatekeeper blocking unsigned apps.

**Solution**:
```bash
xattr -cr /Applications/FinanceQuest.app
```
Then try opening again using the Control-Click method.

### App Won't Start
- **Check**: macOS 10.13 or later
- **Verify**: You used Control-Click → Open on first launch
- **Try**: Remove quarantine attribute (command above)

### Data Not Saving
- Check disk space
- Ensure the app has permission to write to Application Support

### Performance Issues
- Close other applications to free up RAM
- Minimum 4 GB RAM recommended

---

## 💾 Data Location

FinanceQuest stores your data at:
```
~/Library/Application Support/app.renkaistudios.financequest/
```

To access:
1. Open Finder
2. Go to **Go** menu → **Go to Folder** (⇧⌘G)
3. Paste the path above

---

## 📞 Support

- **Issues**: https://github.com/Rensjo/FinanceQuest_Campus-Edition/issues
- **Discussions**: https://github.com/Rensjo/FinanceQuest_Campus-Edition/discussions
- **Email**: support@renkaistudios.com

---

## 📝 Version Information

- **Version**: 0.1.0
- **Build Date**: 2025
- **Architecture**: Universal (Apple Silicon + Intel)
- **License**: MIT License (see LICENSE.txt)

---

**Enjoy tracking your finances with FinanceQuest! 🎉**
