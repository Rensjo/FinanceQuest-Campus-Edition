# FinanceQuest Campus Edition - Linux Installation Guide

## 📦 Package Contents

This package contains:
- **AppImage** - Universal Linux application (recommended)
- **DEB Package** - For Debian/Ubuntu-based distributions
- **Portable Archive** - TAR.GZ with standalone executable
- **Installation Guide** - This file
- **License** - MIT License

---

## 🚀 Installation Options

### Option 1: AppImage (Recommended - All Distributions)

AppImage works on **all Linux distributions** without installation.

1. **Locate the file**: `FinanceQuest_0.1.0_amd64.AppImage`
2. **Make it executable**:
   ```bash
   chmod +x FinanceQuest_0.1.0_amd64.AppImage
   ```
3. **Run it**:
   ```bash
   ./FinanceQuest_0.1.0_amd64.AppImage
   ```

**Optional**: Move to `/opt` or `~/Applications` for permanent storage.

**Benefits**:
- Works on all distributions
- No installation needed
- Self-contained (includes all dependencies)
- Can run from anywhere

### Option 2: DEB Package (Debian/Ubuntu/Mint/Pop!_OS)

For Debian-based distributions with proper system integration.

1. **Locate the file**: `FinanceQuest_0.1.0_amd64.deb`
2. **Install**:
   ```bash
   sudo dpkg -i FinanceQuest_0.1.0_amd64.deb
   ```
3. **If dependencies missing**:
   ```bash
   sudo apt-get install -f
   ```
4. **Launch** from Applications menu or:
   ```bash
   financequest
   ```

**Installation Location**: `/usr/bin/financequest`

**Benefits**:
- Application menu integration
- Desktop shortcuts
- Clean uninstall via package manager
- Automatic dependency resolution

### Option 3: Portable Executable (TAR.GZ)

Standalone executable with no installation.

1. **Extract the archive**:
   ```bash
   tar -xzf FinanceQuest-Linux-Portable.tar.gz
   ```
2. **Navigate to folder**:
   ```bash
   cd FinanceQuest-Linux-Portable
   ```
3. **Run the executable**:
   ```bash
   ./financequest
   ```

**Note**: Can be run from USB drive, home directory, or any location.

---

## 🔧 System Requirements

- **Architecture**: x86_64 (64-bit)
- **RAM**: 4 GB minimum
- **Disk Space**: 150 MB
- **Display**: 1024x768 minimum resolution

**Supported Distributions**:
- Ubuntu 20.04+
- Debian 11+
- Fedora 35+
- Arch Linux
- openSUSE Leap 15.3+
- Linux Mint 20+
- Pop!_OS 20.04+
- And most other modern distributions

---

## 📋 Dependencies

### AppImage
No dependencies! Everything is included.

### DEB Package
Automatically installed by apt:
- `libgtk-3-0`
- `libwebkit2gtk-4.0-37`
- `libayatana-appindicator3-1`

### Portable
May require installing:
```bash
# Debian/Ubuntu
sudo apt-get install libgtk-3-0 libwebkit2gtk-4.0-37

# Fedora
sudo dnf install gtk3 webkit2gtk3

# Arch Linux
sudo pacman -S gtk3 webkit2gtk
```

---

## 🎮 First Launch

1. **Launch FinanceQuest**
2. **Set your monthly budget** (optional - can skip)
3. **Start tracking expenses** immediately!

---

## 🔄 Updating

### AppImage:
1. Download new AppImage
2. Replace old file
3. Make executable: `chmod +x FinanceQuest_*.AppImage`

### DEB Package:
```bash
sudo dpkg -i FinanceQuest_[NEW_VERSION]_amd64.deb
```

### Portable:
Extract new version over old one (data preserved in separate folder)

---

## 🗑️ Uninstalling

### AppImage:
Simply delete the `.AppImage` file

### DEB Package:
```bash
sudo apt-get remove financequest
# or
sudo dpkg -r financequest
```

### Portable:
Delete the extracted folder

**Optional**: Remove data folder:
```bash
rm -rf ~/.local/share/app.renkaistudios.financequest/
```

---

## 🐛 Troubleshooting

### AppImage Won't Run
**"cannot execute binary file"**:
```bash
chmod +x FinanceQuest_*.AppImage
```

**Missing FUSE**:
```bash
# Debian/Ubuntu
sudo apt-get install fuse

# Fedora
sudo dnf install fuse

# Arch
sudo pacman -S fuse2
```

### DEB Installation Fails
**Dependencies missing**:
```bash
sudo apt-get update
sudo apt-get install -f
```

### App Won't Start
**Check dependencies**:
```bash
ldd /usr/bin/financequest  # For DEB
ldd ./financequest          # For portable
```

**Graphics issues**:
```bash
# Try with software rendering
LIBGL_ALWAYS_SOFTWARE=1 ./financequest
```

### Permission Denied
```bash
chmod +x financequest
# or for AppImage
chmod +x FinanceQuest_*.AppImage
```

---

## 💾 Data Location

FinanceQuest stores your data at:
```
~/.local/share/app.renkaistudios.financequest/
```

To backup:
```bash
tar -czf financequest-backup.tar.gz ~/.local/share/app.renkaistudios.financequest/
```

---

## 🔒 AppImage Integration (Optional)

To add AppImage to application menu:

1. **Install AppImageLauncher**:
   ```bash
   # Ubuntu/Debian
   sudo add-apt-repository ppa:appimagelauncher-team/stable
   sudo apt-get update
   sudo apt-get install appimagelauncher
   ```

2. **Double-click AppImage** - AppImageLauncher will integrate it automatically

Or manually create desktop entry:
```bash
cat > ~/.local/share/applications/financequest.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=FinanceQuest
Exec=/path/to/FinanceQuest_0.1.0_amd64.AppImage
Icon=financequest
Categories=Office;Finance;
EOF
```

---

## 📞 Support

- **Issues**: https://github.com/Rensjo/FinanceQuest_Campus-Edition/issues
- **Discussions**: https://github.com/Rensjo/FinanceQuest_Campus-Edition/discussions
- **Email**: support@renkaistudios.com

---

## 📝 Version Information

- **Version**: 0.1.0
- **Build Date**: 2025
- **Architecture**: x86_64
- **License**: MIT License (see LICENSE.txt)

---

**Enjoy tracking your finances with FinanceQuest! 🎉**
