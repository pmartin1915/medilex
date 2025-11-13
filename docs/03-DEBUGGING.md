# 🐛 Debugging & Troubleshooting Guide

Complete guide for debugging the Healthcare Vocab App.

---

## 🚀 Quick Debug Checklist

When something goes wrong, follow this order:

1. ✅ **Check Debug Tab** in app (bug icon at bottom)
2. ✅ **Clear Metro cache**: `npx expo start --clear`
3. ✅ **Restart emulator**: `.\scripts\android\restart-emulator.bat`
4. ✅ **Check this guide** for specific issues
5. ✅ **Check error logs** in Debug tab

---

## 🛠️ Built-in Debug Tools

### 1. Debug Tab (In-App)
The app has a comprehensive debug panel:

**Access**: Tap the bug icon (🐛) at bottom of app

**Features**:
- **Error Logs** - View all errors with timestamps
- **Storage** - Inspect AsyncStorage data
- **State** - View current app state
- **Tests** - Run diagnostic tests

**Error Logs Tab**:
- See all errors in real-time
- Tap any error to copy details
- "Copy All" button for bulk copy
- Color-coded by severity (red = error, yellow = warning)
- Smart timestamps ("5m ago", "Just now")

**Storage Tab**:
- View all AsyncStorage keys
- Tap key to see value
- Clear storage button (with confirmation)

**State Tab**:
- Live app state inspection
- Terms count
- Progress entries
- Current streak
- Sample terms preview

**Tests Tab**:
- Run 8 automated diagnostic tests
- Validates data integrity
- Checks functionality
- Platform compatibility
- Color-coded pass/fail results

### 2. Error Toast Notifications
In development mode, errors show as toast notifications:
- Appear at top of screen
- Auto-dismiss after 5 seconds
- Tap to navigate to Debug tab
- Only in `__DEV__` mode

### 3. Error Logger System
Automatic error capture and logging:
- All console.error() calls logged
- All console.warn() calls logged
- Global error handler
- Persistent storage (max 50 logs)
- Structured output for easy parsing

---

## 🔍 Common Issues & Solutions

### App Won't Start

#### Issue: "Cannot read property 'S' of undefined"
**Cause**: AsyncStorage accessed before React Native initialized

**Solution**:
```bash
# Already fixed in errorLogger.ts
# If still occurring, clear cache:
npx expo start --clear
```

#### Issue: "Metro bundler won't start"
**Solution**:
```bash
# Kill existing Metro processes
taskkill /F /IM node.exe

# Clear cache and restart
npx expo start --clear
```

#### Issue: "The system cannot find the path specified"
**Cause**: ANDROID_HOME not set

**Solution**:
```bash
# Use the launcher scripts (they set paths automatically)
.\LAUNCH.bat
# or
.\quick-start.bat
```

### Android Emulator Issues

#### Issue: "Emulator not detected"
**Check**:
```bash
# Verify ADB connection
adb devices

# Should show:
# List of devices attached
# emulator-5554   device
```

**Solution**:
```bash
# Restart ADB
adb kill-server
adb start-server

# Or use helper script
.\scripts\android\verify-android-setup.bat
```

#### Issue: "Emulator is slow/frozen"
**Solution**:
```bash
# Restart emulator
.\scripts\android\restart-emulator.bat

# Or cold boot from Android Studio
```

#### Issue: "App installed but won't open"
**Solution**:
```bash
# Clear app data
adb shell pm clear com.anonymous.healthcarevocabapp

# Reinstall
npx expo run:android
```

### Runtime Errors

#### Issue: "AsyncStorage errors"
**Check Debug Tab** → Storage tab

**Common causes**:
- Corrupted data
- Storage quota exceeded
- Invalid JSON

**Solution**:
```typescript
// App handles this automatically with try-catch
// Manual fix: Clear storage in Debug tab
```

#### Issue: "State not persisting"
**Check**:
1. Debug tab → Storage tab
2. Verify keys exist: `@vocab_app:terms`, `@vocab_app:user_progress`

**Solution**:
```bash
# Reload app data
# In Debug tab → Tests → Run Tests
# Check "AsyncStorage Access" test
```

#### Issue: "Swipe gestures not working"
**Check**:
- Test on physical device (gestures work better)
- Verify react-native-gesture-handler installed
- Check console for gesture errors

**Solution**:
```bash
# Reinstall gesture handler
npm install react-native-gesture-handler
npx expo prebuild --clean
```

### Test Failures

#### Issue: "31 tests failing"
**Current status**: Known issue, non-blocking

**Common failures**:
- Mock issues (AsyncStorage, Navigation)
- Async timing issues
- Snapshot mismatches

**Solution**:
```bash
# Run specific test to debug
npm test -- ComponentName.test.tsx --verbose

# Update snapshots if needed
npm test -- -u
```

#### Issue: "Tests timeout"
**Solution**:
```typescript
// Increase timeout in test
it('test name', async () => {
  // test code
}, 10000); // 10 seconds
```

### TypeScript Errors

#### Issue: "Type errors in IDE"
**Solution**:
```bash
# Run type check
npm run type-check

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 🔧 Debug Scripts

### Windows Batch Scripts

#### `LAUNCH.bat` (Main Launcher)
```bash
.\LAUNCH.bat
```
- Sets Android SDK paths
- Launches emulator if needed
- Starts Metro bundler
- Auto-launches app

#### `quick-start.bat` (Fast Android Start)
```bash
.\quick-start.bat
```
- Quick Android-only start
- Assumes emulator running
- Faster than LAUNCH.bat

#### Android Scripts
```bash
# Verify Android setup
.\scripts\android\verify-android-setup.bat

# Restart emulator
.\scripts\android\restart-emulator.bat

# Launch emulator
.\scripts\android\launch-emulator.bat
```

#### Testing Scripts
```bash
# Run all tests
.\scripts\testing\test-app-features.bat

# Quick verification
.\scripts\testing\quick-verify-all.bat
```

---

## 📊 Monitoring & Logs

### Metro Bundler Logs
```bash
# Start with verbose logging
npx expo start --clear

# Watch for:
# - Bundle errors
# - Transform errors
# - Module resolution issues
```

### Android Logcat
```bash
# Filter for app logs
adb logcat | findstr "VOCAB_APP"

# Filter for errors
adb logcat | findstr "ERROR"

# Clear logs
adb logcat -c
```

### Error Logger Output
In development, structured errors output to console:
```
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 [VOCAB_APP_ERROR] Type: ERROR
🏥 [VOCAB_APP_ERROR] Time: 10:30:45 AM
🏥 [VOCAB_APP_ERROR] Context: LearnScreen
🏥 [VOCAB_APP_ERROR] Message: Failed to load terms
🏥 [VOCAB_APP_ERROR] Stack: Error: ...
🏥 [VOCAB_APP_ERROR] ID: 1234567890_abc123
🏥 [VOCAB_APP_ERROR] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Debugging Workflow

### For New Bugs

1. **Reproduce**
   - Can you reproduce consistently?
   - What steps trigger it?
   - Which platform (Android/iOS/Web)?

2. **Check Debug Tab**
   - Any errors logged?
   - What's the error message?
   - What's the stack trace?

3. **Check State**
   - Debug tab → State tab
   - Is data loaded correctly?
   - Are stores initialized?

4. **Check Storage**
   - Debug tab → Storage tab
   - Is data persisted?
   - Any corrupted data?

5. **Run Tests**
   - Debug tab → Tests tab
   - Which tests fail?
   - What's the failure message?

6. **Isolate**
   - Can you reproduce in isolation?
   - Is it component-specific?
   - Is it platform-specific?

7. **Fix & Verify**
   - Make fix
   - Test thoroughly
   - Run automated tests
   - Check on all platforms

### For Performance Issues

1. **Profile**
   - Use React DevTools Profiler
   - Check for unnecessary re-renders
   - Look for memory leaks

2. **Optimize**
   - Memoize expensive computations
   - Use React.memo for pure components
   - Optimize images and assets

3. **Measure**
   - Before/after comparison
   - Test on slower devices
   - Monitor memory usage

---

## 🚨 Emergency Procedures

### Nuclear Option (Last Resort)
```bash
# 1. Clear all caches
npx expo start --clear

# 2. Clear node modules
rmdir /s /q node_modules
npm install

# 3. Clear Android build
cd android
.\gradlew clean
cd ..

# 4. Rebuild
npx expo prebuild --clean
npx expo run:android
```

### Reset App Data
```bash
# Clear app data on device
adb shell pm clear com.anonymous.healthcarevocabapp

# Or in Debug tab → Storage → Clear All Storage
```

### Reset Development Environment
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Kill ADB
adb kill-server

# Restart everything
.\LAUNCH.bat
```

---

## 📚 Debug Resources

### Internal Documentation
- [DEBUGGING-GUIDE.md](../DEBUGGING-GUIDE.md) - Extended guide
- [CLAUDE-AUTONOMOUS-TESTING.md](../CLAUDE-AUTONOMOUS-TESTING.md) - AI testing
- [CHECK_LOGS.md](../CHECK_LOGS.md) - Log analysis

### External Resources
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo Debugging](https://docs.expo.dev/debugging/runtime-issues/)
- [React DevTools](https://react-devtools-tutorial.vercel.app/)

---

## 💡 Pro Tips

### Development
- Always use `.\LAUNCH.bat` to start
- Check Debug tab frequently
- Run tests before committing
- Clear cache when in doubt

### Debugging
- Start with Debug tab (easiest)
- Use error logger output (structured)
- Check state before storage
- Test on physical device when possible

### Error Handling
- All async operations have try-catch
- All errors logged automatically
- User-friendly error messages
- Graceful degradation

---

## 🎓 Learning from Errors

### Common Patterns

**Pattern 1: AsyncStorage Errors**
- Always wrap in try-catch
- Validate data before saving
- Handle corrupted data gracefully

**Pattern 2: State Update Errors**
- Check if component mounted
- Validate data structure
- Use optimistic updates

**Pattern 3: Navigation Errors**
- Verify screen exists
- Check navigation params
- Handle back navigation

---

*Last Updated: January 2025*
