# Platform-Specific Fixes

## 🎉 NEW FEATURE: Vertical Swipe Navigation

The vertical swipe feature has been implemented! After fixing the platform issues below, you'll be able to:
- **Swipe UP ↑** - Navigate to next card (without evaluation)
- **Swipe DOWN ↓** - Navigate to previous card
- **Swipe LEFT ←** - Don't Know (evaluates knowledge)
- **Swipe RIGHT →** - Know It (evaluates knowledge)

---

## 📱 iOS - Fix Metro Bundler Cache Issue

Your iOS device is showing the old version because Metro bundler has cached the previous code.

### Solution: Nuclear Cache Clear

On your **Windows computer**, in the project directory:

```powershell
# 1. Stop Metro bundler (Ctrl+C in the terminal where it's running)

# 2. Run the aggressive cache clear:
npm cache clean --force
rmdir /s /q node_modules\.cache
rmdir /s /q .expo
rmdir /s /q %TEMP%\haste-map-*
rmdir /s /q %TEMP%\metro-*

# 3. Start Metro with full cache reset:
npx expo start --clear
```

**Alternative**: Use the provided script:
```powershell
.\clear-cache.bat
# Then manually run:
npx expo start --clear
```

### On Your iOS Device:

1. **Completely close** the Expo Go app (swipe up from app switcher)
2. **Reopen** Expo Go
3. Scan the QR code again
4. If still showing old version:
   - Shake device to open dev menu
   - Tap "Reload"
   - Still not working? Delete Expo Go app and reinstall from App Store

---

## 🤖 Android - Emulator Won't Launch App

The Android emulator launches but the app won't load. This is typically due to:
1. ADB connection issues
2. Package manager service not responding
3. App cache corruption

### Solution: Full Reset Process

**Option 1: Use the Troubleshooter Script** (Recommended)
```powershell
.\troubleshoot.bat
```
Then select option **5** (Start from scratch - full reset)

**Option 2: Manual Step-by-Step**

```powershell
# 1. Kill all processes
taskkill /F /IM node.exe
taskkill /F /IM qemu-system-x86_64.exe
adb kill-server

# 2. Wait a moment
timeout /t 3

# 3. Clear all caches
rmdir /s /q node_modules\.cache
rmdir /s /q .expo
rmdir /s /q %TEMP%\haste-map-*
rmdir /s /q %TEMP%\metro-*

# 4. Restart ADB
adb start-server

# 5. Launch emulator (replace with your AVD name)
emulator -avd Medium_Phone_API_36.1 -no-snapshot-load

# 6. Wait for emulator to fully boot (watch for home screen)
# Then in another terminal:
adb wait-for-device

# 7. Verify package manager is working
adb shell pm list packages

# 8. Start Metro bundler
npx expo start --clear

# 9. Press 'a' to launch on Android
```

### Common Android Issues:

**"Can't find service: package" error**
```powershell
.\fix-adb-quick.bat
# Then press 'a' in Metro bundler
```

**Emulator frozen/not responding**
```powershell
.\restart-emulator.bat
```

**App shows white/black screen**
- This was the TurboModuleRegistry error (now fixed in code)
- Clear cache and reload:
  ```powershell
  .\clear-cache.bat
  npx expo start --clear
  ```

---

## 🌐 Web Version

The web version is **fully supported** and configured!

### To Run Web Version:

```powershell
npm run web
```

Or:
```powershell
npx expo start --web
```

This will:
1. Build the web version
2. Open in your default browser at `http://localhost:8081`
3. Support hot reloading

**Web version includes:**
- ✅ All features (Learn, Review, Progress tabs)
- ✅ Swipe gestures (use mouse drag)
- ✅ Speech pronunciation
- ✅ Full Zustand state management
- ✅ Responsive design

### Web-Specific Notes:
- Swipe gestures work with mouse drag
- Some native features (like device haptics) won't work on web
- For best experience, use Chrome or Firefox

---

## 🔄 Getting the Latest Code

You mentioned you pulled but didn't see changes. Here's the correct process:

```powershell
# 1. Check which branch you're on
git branch

# 2. Make sure you're on the correct branch
git checkout claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB

# 3. Pull latest changes
git pull origin claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB

# 4. Clear ALL caches (important!)
npm cache clean --force
rmdir /s /q node_modules\.cache
rmdir /s /q .expo

# 5. Restart Metro bundler with cache clear
npx expo start --clear
```

---

## 📋 Quick Reference

### iOS Not Updating?
```powershell
npx expo start --clear
# Close Expo Go completely, reopen, rescan QR
```

### Android Not Launching?
```powershell
.\troubleshoot.bat
# Select option 5 (full reset)
```

### Want to Try Web?
```powershell
npm run web
```

### Check Your Branch
```powershell
git branch
# Should show: * claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB
```

---

## 🆘 Still Having Issues?

If none of the above works:

1. **Verify Node/npm versions**:
   ```powershell
   node --version  # Should be v18 or higher
   npm --version   # Should be v8 or higher
   ```

2. **Reinstall dependencies**:
   ```powershell
   rmdir /s /q node_modules
   npm install
   ```

3. **Check Expo CLI version**:
   ```powershell
   npx expo --version
   ```

4. **For Android, verify emulator is listed**:
   ```powershell
   emulator -list-avds
   adb devices
   ```

5. **Check for port conflicts**:
   - Metro bundler uses port 8081
   - Make sure nothing else is using it
   ```powershell
   netstat -ano | findstr :8081
   ```
