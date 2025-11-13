# 🔧 Scripts Directory

Helper scripts for development, testing, and maintenance.

---

## 🚀 Quick Reference

### Most Used Scripts (Root Level)
```bash
.\LAUNCH.bat              # Main launcher - use this!
.\quick-start.bat         # Quick Android start
.\test-app-features.bat   # Run feature tests
```

---

## 📁 Folder Structure

### `android/`
Android-specific development scripts:
- `launch-emulator.bat` - Launch Android emulator
- `restart-emulator.bat` - Restart emulator
- `setup-android-env.bat` - Configure Android SDK paths
- `verify-android-setup.bat` - Verify Android environment
- `list-emulators.bat` - List available emulators
- `monitor-android-live.bat` - Monitor Android logs

### `testing/`
Testing and verification scripts:
- `test-android-auto.bat` - Automated Android tests
- `test-android-complete.bat` - Complete Android test suite
- `test-android-fix.bat` - Test Android fixes
- `test-ios.bat` - iOS testing
- `test-ios-fix.bat` - Test iOS fixes
- `test-web.bat` - Web platform testing
- `test-phase2.bat` - Phase 2 tests
- `test-professional-polish.bat` - Polish phase tests
- `quick-verify-all.bat` - Quick verification all platforms
- `quick-verify-ios.bat` - Quick iOS verification
- `quick-verify.bat` - Quick Android verification
- `verify-android-automation.bat` - Verify automation setup

### `maintenance/`
Maintenance and utility scripts:
- `rebuild-native.bat` - Rebuild native modules
- `sync-with-git.bat` - Git synchronization
- `troubleshoot.bat` - Troubleshooting utilities
- `git-helper.bat` - Git helper commands
- `commit-phase2.bat` - Phase 2 commit helper
- `RESOLVE_CONFLICTS.bat` - Resolve merge conflicts
- `GET_LATEST_CODE.bat` - Pull latest code
- `get-current-errors.bat` - Extract current errors
- `QUICK_FIX.bat` - Quick fix utilities
- `QUICK_FIX_ALL_PLATFORMS.bat` - Multi-platform fixes

---

## 📖 Script Usage Guide

### Android Development

#### Start Development
```bash
# Option 1: Full launcher (recommended)
.\LAUNCH.bat

# Option 2: Quick start (if emulator running)
.\quick-start.bat

# Option 3: Manual emulator launch
.\scripts\android\launch-emulator.bat
# Then start Metro
npx expo start
```

#### Troubleshoot Android
```bash
# Verify setup
.\scripts\android\verify-android-setup.bat

# Restart emulator
.\scripts\android\restart-emulator.bat

# Monitor logs
.\scripts\android\monitor-android-live.bat
```

### Testing

#### Run Tests
```bash
# Feature tests
.\test-app-features.bat

# Quick verification
.\scripts\testing\quick-verify-all.bat

# Platform-specific
.\scripts\testing\test-android-auto.bat
.\scripts\testing\test-ios.bat
.\scripts\testing\test-web.bat
```

### Maintenance

#### Clean & Rebuild
```bash
# Rebuild native modules
.\scripts\maintenance\rebuild-native.bat

# Troubleshoot issues
.\scripts\maintenance\troubleshoot.bat
```

#### Git Operations
```bash
# Sync with remote
.\scripts\maintenance\sync-with-git.bat

# Get latest code
.\scripts\maintenance\GET_LATEST_CODE.bat

# Resolve conflicts
.\scripts\maintenance\RESOLVE_CONFLICTS.bat
```

---

## 🎯 Common Tasks

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Verify Android setup
.\scripts\android\verify-android-setup.bat

# 3. Launch app
.\LAUNCH.bat
```

### Daily Development
```bash
# Start app
.\LAUNCH.bat

# Make changes...

# Test
npm test

# Commit
git add .
git commit -m "feat: description"
```

### Troubleshooting
```bash
# 1. Check Android setup
.\scripts\android\verify-android-setup.bat

# 2. Restart emulator
.\scripts\android\restart-emulator.bat

# 3. Clear cache
npx expo start --clear

# 4. Run troubleshooter
.\scripts\maintenance\troubleshoot.bat
```

---

## 💡 Script Best Practices

### When to Use Scripts
- ✅ Starting development (LAUNCH.bat)
- ✅ Testing features (test-app-features.bat)
- ✅ Troubleshooting (verify-android-setup.bat)
- ✅ Maintenance tasks (rebuild-native.bat)

### When NOT to Use Scripts
- ❌ Simple npm commands (use `npm test` directly)
- ❌ One-time operations (use manual commands)
- ❌ Custom workflows (create your own script)

### Creating New Scripts
1. Place in appropriate folder (android/, testing/, maintenance/)
2. Use `.bat` extension for Windows
3. Add error handling
4. Document in this README
5. Test thoroughly

---

## 🔍 Script Details

### LAUNCH.bat (Root)
**Purpose**: Main application launcher  
**What it does**:
- Sets Android SDK environment variables
- Launches emulator if not running
- Waits for emulator to boot
- Starts Metro bundler
- Auto-launches app

**Usage**: `.\LAUNCH.bat`

### quick-start.bat (Root)
**Purpose**: Fast Android start  
**What it does**:
- Assumes emulator is running
- Sets Android SDK paths
- Starts Metro bundler
- Faster than LAUNCH.bat

**Usage**: `.\quick-start.bat`

### test-app-features.bat (Root)
**Purpose**: Feature testing  
**What it does**:
- Validates ADB connection
- Checks Metro bundler
- Verifies project structure
- Tests key features
- Generates report

**Usage**: `.\test-app-features.bat`

---

## 🐛 Troubleshooting Scripts

### Script Won't Run
```bash
# Check if file exists
dir scripts\android\

# Run with full path
d:\Medilex\HealthcareVocabApp\scripts\android\verify-android-setup.bat
```

### Permission Errors
```bash
# Run as administrator
# Right-click → Run as administrator
```

### Path Issues
```bash
# Scripts set ANDROID_HOME automatically
# If issues persist, check:
echo %ANDROID_HOME%
# Should show: C:\Users\<user>\AppData\Local\Android\Sdk
```

---

## 📚 Additional Resources

### Documentation
- [00-START-HERE.md](../docs/00-START-HERE.md) - Project overview
- [01-DEVELOPMENT.md](../docs/01-DEVELOPMENT.md) - Development guide
- [03-DEBUGGING.md](../docs/03-DEBUGGING.md) - Debugging guide

### External
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- [Android Debug Bridge (ADB)](https://developer.android.com/studio/command-line/adb)

---

*Last Updated: January 2025*
