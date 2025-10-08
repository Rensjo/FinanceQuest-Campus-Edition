# 📦 Desktop Build & Release Guide

## Overview

FinanceQuest Campus Edition uses **Tauri v2** for desktop builds with GitHub Actions workflows for automated building and releasing on macOS, Windows, and Linux.

---

## 🚀 Quick Start

### Manual Trigger (Recommended for Testing)

1. Go to **GitHub → Actions** tab
2. Select workflow:
   - `Build All Platforms & Release` (builds all platforms at once)
   - OR individual: `macOS Build`, `Windows Build`, `Linux Build`
3. Click **"Run workflow"** → select branch → **"Run workflow"**
4. Wait for builds to complete (~10-15 minutes)
5. Download artifacts from the workflow run page

### Automatic Release (Tags)

Push a version tag to trigger automatic builds and draft release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

This will:
- Build for all platforms
- Create a GitHub Release draft
- Upload all installers to the release
- Generate release notes automatically

---

## 📋 Workflow Files

### `.github/workflows/build-macos.yml`
Builds macOS applications:
- **Universal Binary** (Apple Silicon + Intel)
- **DMG** installer
- **.app** bundle

**Artifacts:**
- `FinanceQuest-macOS-Universal-DMG`
- `FinanceQuest-macOS-x64-DMG`
- `FinanceQuest-macOS-aarch64-DMG`
- `FinanceQuest-macOS-Universal-app`

### `.github/workflows/build-windows.yml`
Builds Windows applications:
- **MSI** installer (WiX)
- **NSIS** installer (.exe)
- **Portable** executable (ZIP)

**Artifacts:**
- `FinanceQuest-Windows-MSI`
- `FinanceQuest-Windows-NSIS`
- `FinanceQuest-Windows-Portable`

### `.github/workflows/build-linux.yml`
Builds Linux applications:
- **AppImage** (universal)
- **DEB** package (Debian/Ubuntu)
- **Portable** TAR.GZ

**Artifacts:**
- `FinanceQuest-Linux-AppImage`
- `FinanceQuest-Linux-DEB`
- `FinanceQuest-Linux-Portable`

### `.github/workflows/release.yml`
All-in-one workflow that:
- Builds for all platforms simultaneously
- Creates GitHub Release draft
- Uploads all artifacts to release
- Generates release notes

---

## 🔧 Build Requirements

### All Platforms
- **Node.js 20**
- **Rust stable** toolchain
- **Tauri CLI v2.8.4+**

### Platform-Specific

**macOS:**
- Xcode Command Line Tools
- Optional: Apple Developer certificates for signing

**Windows:**
- Visual Studio Build Tools
- Optional: Code signing certificate

**Linux (Ubuntu):**
```bash
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libssl-dev \
  libayatana-appindicator3-dev
```

---

## 🔐 GitHub Secrets (Optional)

For code signing and notarization (production releases):

### Tauri Signing (All Platforms)
- `TAURI_SIGNING_PRIVATE_KEY` - Tauri updater private key
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - Key password

### macOS Code Signing
- `APPLE_CERTIFICATE` - Base64 encoded p12 certificate
- `APPLE_CERTIFICATE_PASSWORD` - Certificate password
- `APPLE_SIGNING_IDENTITY` - Developer ID Application identity
- `APPLE_ID` - Apple ID email
- `APPLE_PASSWORD` - App-specific password
- `APPLE_TEAM_ID` - Team ID

### Windows Code Signing
- `WINDOWS_CERTIFICATE` - Base64 encoded pfx certificate
- `WINDOWS_CERTIFICATE_PASSWORD` - Certificate password

**Note:** Builds work without these secrets, but installers will be unsigned.

---

## 📦 Output Files

### macOS
```
src-tauri/target/universal-apple-darwin/release/bundle/
├── dmg/
│   └── FinanceQuest_0.1.0_universal.dmg
└── macos/
    └── FinanceQuest.app
```

### Windows
```
src-tauri/target/release/bundle/
├── msi/
│   └── FinanceQuest_0.1.0_x64_en-US.msi
└── nsis/
    └── FinanceQuest_0.1.0_x64-setup.exe
```

### Linux
```
src-tauri/target/release/bundle/
├── appimage/
│   └── finance-quest_0.1.0_amd64.AppImage
└── deb/
    └── finance-quest_0.1.0_amd64.deb
```

---

## 🧪 Local Testing

### Build All Platforms Locally

**macOS:**
```bash
npm ci
npm run build
npm run tauri:build
```

**Windows:**
```powershell
npm ci
npm run build
npm run tauri:build
```

**Linux:**
```bash
npm ci
npm run build
npm run tauri:build
```

### Test Specific Target

**macOS Universal:**
```bash
npm run tauri build -- --target universal-apple-darwin
```

**Windows MSI only:**
```bash
npm run tauri build -- --bundles msi
```

**Linux AppImage only:**
```bash
npm run tauri build -- --bundles appimage
```

---

## 🎯 Release Process

### 1. Update Version

Update version in:
- `package.json`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`

```bash
# All at once (recommended)
npm version patch  # or minor, major
```

### 2. Update Changelog

Update `CHANGELOG.md` with changes for this version.

### 3. Commit Changes

```bash
git add .
git commit -m "chore: bump version to v0.1.0"
git push origin main
```

### 4. Create Release Tag

```bash
git tag v0.1.0
git push origin v0.1.0
```

### 5. Wait for Builds

- Go to GitHub Actions
- Wait for `Build All Platforms & Release` to complete (~10-15 min)
- Check for any errors

### 6. Publish Release

- Go to GitHub Releases
- Find the draft release
- Edit description if needed
- Click **"Publish release"**

---

## 📝 Version Naming

Follow semantic versioning: `vMAJOR.MINOR.PATCH`

Examples:
- `v0.1.0` - Initial release
- `v0.2.0` - New features
- `v0.2.1` - Bug fixes
- `v1.0.0` - First stable release

---

## 🐛 Troubleshooting

### Build Fails on macOS

**Error:** "No code signing identity found"
- Builds will still work without signing
- Add signing secrets for signed builds
- Or disable signing in workflow

**Error:** "Failed to notarize"
- Notarization is optional for testing
- Required for distribution outside Mac App Store

### Build Fails on Windows

**Error:** "MSBuild not found"
- Install Visual Studio Build Tools
- Or use GitHub Actions (already configured)

**Error:** "WiX not found"
- Tauri automatically downloads WiX
- Check internet connection

### Build Fails on Linux

**Error:** "webkit2gtk not found"
- Install missing dependencies (see Build Requirements)
- Use `sudo apt-get update` first

### Artifacts Not Uploaded

**Check:**
1. Workflow completed successfully?
2. Look for "if-no-files-found: warn" in logs
3. Verify bundle paths in logs
4. Check `src-tauri/target/release/bundle/` structure

---

## 🔄 Workflow Triggers

### Manual Trigger (workflow_dispatch)
```yaml
on:
  workflow_dispatch:
```
- Available in GitHub Actions UI
- Select any branch
- Good for testing

### Tag Push
```yaml
on:
  push:
    tags:
      - 'v*'
```
- Automatically triggers on version tags
- Only runs on tags starting with 'v'
- Creates GitHub Release draft

### Both (Recommended)
```yaml
on:
  workflow_dispatch:
  push:
    tags:
      - 'v*'
```

---

## 📊 Build Times (Approximate)

| Platform | Time    | Notes |
|----------|---------|-------|
| macOS    | 12-15m  | Universal binary (2 targets) |
| Windows  | 8-10m   | MSI + NSIS installers |
| Linux    | 6-8m    | AppImage + DEB |
| **All**  | **15-20m** | Parallel execution |

---

## 🎨 Customization

### Change App Name
Edit `src-tauri/tauri.conf.json`:
```json
{
  "productName": "Your App Name"
}
```

### Change App Icon
Replace files in `icons/` directory:
- `icon.png` (512x512)
- `icon.ico` (Windows)
- `icon.icns` (macOS)

### Change Bundle ID
Edit `src-tauri/tauri.conf.json`:
```json
{
  "identifier": "com.yourcompany.yourapp"
}
```

### Modify Build Targets
Edit workflows to change platforms:
```yaml
matrix:
  include:
    - platform: 'macos-latest'
      target: 'aarch64-apple-darwin'  # Apple Silicon only
```

---

## 📚 Resources

- [Tauri Documentation](https://tauri.app/)
- [Tauri GitHub Actions](https://github.com/tauri-apps/tauri-action)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist for First Release

- [ ] Update version in `package.json`
- [ ] Update version in `src-tauri/tauri.conf.json`
- [ ] Update version in `src-tauri/Cargo.toml`
- [ ] Update `CHANGELOG.md`
- [ ] Test build locally (at least one platform)
- [ ] Commit changes
- [ ] Create and push tag
- [ ] Wait for GitHub Actions
- [ ] Download and test artifacts
- [ ] Publish GitHub Release
- [ ] Announce on social media/website

---

## 🆘 Support

**Issues with builds?**
1. Check GitHub Actions logs
2. Search [Tauri Discussions](https://github.com/tauri-apps/tauri/discussions)
3. Open an issue in this repo

**Need help?**
- Discord: [Tauri Discord](https://discord.gg/tauri)
- GitHub Discussions: [FinanceQuest Discussions](https://github.com/Rensjo/FinanceQuest_Campus-Edition/discussions)

---

**Happy Building! 🚀**
