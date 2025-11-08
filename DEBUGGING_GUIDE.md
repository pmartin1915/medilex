# Healthcare Vocab App - Debugging Guide

## Problem: White/Black Screen on Android Emulator

This guide will help you systematically debug and resolve the white/black screen issue.

---

## 🔧 Changes Made

### 1. **Error Logging System** (`src/utils/errorLogger.ts`)
- Captures all console errors and warnings
- Persists errors to AsyncStorage
- Provides global error handler for unhandled errors

### 2. **Startup Diagnostics** (`src/components/StartupLoader.tsx`)
- Shows detailed initialization progress
- Tests each dependency step-by-step
- Displays errors inline during startup

### 3. **Debug Screen** (`src/screens/DebugScreen.tsx`)
- New "Debug" tab in bottom navigation (bug icon)
- View all error logs
- Inspect AsyncStorage contents
- Check app state (stores, data)

### 4. **Enhanced Error Boundary** (`src/components/ErrorBoundary.tsx`)
- Shows full error details with stack traces
- Logs errors to error logger
- Provides better visibility of React errors

### 5. **Configuration Fixes**
- **Disabled New Architecture** in `app.json` (known to cause issues)
- **Removed edge-to-edge** Android settings
- **Added metro.config.js** for proper bundling
- **Added Android package name** for proper identification

---

## 🚀 Step-by-Step Debugging Process

### Step 1: Clear Everything and Reinstall

1. **Close all Metro bundlers and terminals**

2. **Run the clear cache script:**
   ```bash
   clear-cache.bat
   ```

3. **Reinstall dependencies:**
   ```bash
   npm install
   ```

### Step 2: Start Fresh

1. **Start the Android emulator first** (if not running)
   - Open Android Studio
   - Launch your Android emulator
   - Wait for it to fully boot

2. **Run the app:**
   ```bash
   start-android.bat
   ```

### Step 3: Watch the Startup Loader

When the app launches, you should now see:
- **Startup screen** with detailed progress
- **Each initialization step** (Error Logger, App Data, AsyncStorage, Navigation)
- **Success checkmarks** as each step completes
- **Error messages** if any step fails

**What to look for:**
- ✓ All steps should complete with green checkmarks
- ✗ If any step shows a red X, note the error message
- The error message will tell you exactly what's failing

### Step 4: Check the Debug Tab

Once the app loads (or if it shows errors):

1. **Tap the "Debug" tab** (bug icon at bottom right)
2. **View the "Logs" tab** to see all captured errors
3. **View the "Storage" tab** to check AsyncStorage data
4. **View the "State" tab** to verify app state

**What to look for:**
- Are there any error logs?
- Is AsyncStorage working? (should show keys like `@vocab_app:terms`)
- Are terms loaded? (should show 5 terms in State tab)

### Step 5: Check Metro Bundler Output

Look at the terminal/command prompt where `start-android.bat` is running:

**Good signs:**
```
✓ Built the app successfully
✓ Connected to Metro
```

**Bad signs:**
```
× Build failed
× Module not found
× Syntax error
```

### Step 6: Check Android Logcat (Advanced)

If you still see a white screen:

1. **Open a new terminal**
2. **Run:**
   ```bash
   cd D:\Medilex\HealthcareVocabApp
   npx react-native log-android
   ```
3. **Look for RED errors** in the output
4. **Copy any error messages** you see

---

## 🐛 Common Issues and Solutions

### Issue 1: "Cannot find module" errors

**Solution:**
```bash
clear-cache.bat
npm install
```

### Issue 2: Metro bundler not starting

**Solution:**
```bash
# Kill any existing processes
taskkill /F /IM node.exe

# Start fresh
npx expo start --clear
```

### Issue 3: Android build errors

**Solution:**
```bash
# In the project directory
cd android
gradlew clean
cd ..
npx expo start
```

### Issue 4: "Network request failed" during startup

**Solution:**
- Check your internet connection
- AsyncStorage might be blocked
- Check the Debug tab → Storage to verify

### Issue 5: Still white screen after all checks

**Solution:**
1. Check if the emulator is properly configured
2. Try restarting the emulator
3. Try a different emulator
4. Check the Debug tab for hidden errors

---

## 📱 Using the Debug Features

### Error Logger
- **Automatically captures** all console.error() and console.warn()
- **Persists to AsyncStorage** so errors survive app restarts
- **View in Debug tab** → Logs

### Clear Logs
- Open Debug tab → Logs
- Tap the trash icon to clear old logs
- Useful for finding new errors

### View Storage
- Open Debug tab → Storage
- Tap any key to view its contents
- Look for:
  - `@vocab_app:terms` - Medical terms data
  - `@vocab_app:user_progress` - Your progress
  - `@vocab_app:streak` - Streak data
  - `@vocab_app:error_logs` - Error logs

### Check App State
- Open Debug tab → State
- Verify:
  - Terms Loaded: should be 5
  - Current Streak: your streak number
  - Study Dates: list of dates you studied

---

## 📋 What to Report Back

If you're still having issues, please check and report:

1. **Startup Loader Status:**
   - Which steps completed successfully?
   - Which step failed (if any)?
   - What error message showed?

2. **Debug Tab - Logs:**
   - How many error logs?
   - What do the most recent 3 errors say?
   - Take a screenshot if possible

3. **Debug Tab - Storage:**
   - How many storage keys exist?
   - Are the `@vocab_app:*` keys present?

4. **Metro Bundler Output:**
   - Any red errors in the terminal?
   - Did the build complete?

5. **Android Logcat (if you ran it):**
   - Any Java/native crashes?
   - Any "FATAL" errors?

---

## 🎯 Expected Behavior

**On successful startup, you should see:**

1. **Startup Loader** (2-3 seconds):
   - "Initializing Error Logger" ✓
   - "Loading App Data" ✓
   - "Checking AsyncStorage" ✓
   - "Initializing Navigation" ✓

2. **Home Screen** with:
   - Streak calendar at top
   - "Word of the Day" card (should show "tachycardia")
   - "Terms Available: 5"
   - "Start Study Session" button

3. **Bottom Navigation** with 5 tabs:
   - Home
   - Learn
   - Library
   - Progress
   - Debug (new!)

---

## 🔄 Reset Everything (Nuclear Option)

If nothing else works:

```bash
# 1. Clear everything
clear-cache.bat

# 2. Delete package-lock.json
del package-lock.json

# 3. Fresh install
npm install

# 4. Start completely fresh
npx expo start --clear
```

Then press `a` to open on Android.

---

## 💡 Tips

- **Always check the Debug tab first** - it's now your best friend
- **The startup loader shows exactly where it fails** - no more guessing
- **Error logs persist** - even if the app crashes, check Debug tab when it restarts
- **Use clear-cache.bat** whenever things seem weird
- **Metro bundler needs to be running** - you should see the terminal with Metro output

---

## 🆘 Still Stuck?

If you've gone through all these steps and still have a white screen:

1. Take a screenshot of the **Startup Loader** (if it shows)
2. Take a screenshot of **Debug tab → Logs**
3. Copy the **Metro bundler output** from terminal
4. Copy any **Android logcat errors** (if you ran it)
5. Share these with me and I'll help diagnose further

---

Good luck! The new debugging infrastructure should make it much easier to see what's going wrong.
