# 🚀 Quick Start Guide - Healthcare Vocab App

## The Easiest Way to Get Started

### One-Command Startup (Recommended!)

Just run this and everything will be handled automatically:

```cmd
quick-start.bat
```

**What it does:**
1. ✅ Checks if emulator is running
2. ✅ Launches `Medium_Phone_API_36.1` if needed
3. ✅ Waits for emulator to fully boot
4. ✅ Starts the app with Expo
5. ✅ Opens Metro bundler

**Wait for:** The emulator window to show the Android home screen, then the app will install automatically.

---

## Manual Startup (Step-by-Step)

If you prefer to do it manually or the quick-start has issues:

### Step 1: Launch Emulator

```cmd
launch-emulator.bat
```

**Wait for:** The Android home screen to appear in the emulator window (30-60 seconds).

### Step 2: Start the App

```cmd
start-android.bat
```

Or just:

```cmd
npm run android
```

**What happens:** Metro bundler starts, app installs on emulator, app launches.

---

## 🔍 Monitoring & Debugging (For Development)

### Real-Time Error Monitoring

Open a **second terminal** and run:

```cmd
monitor-app.bat
```

**What you'll see:**
- Live Android logcat output
- App errors with `🏥 [VOCAB_APP_ERROR]` prefix
- React Native JavaScript errors
- Crash reports

### Quick Health Check

```cmd
check-app-status.bat
```

**Shows:**
- ✅ ADB connection status
- ✅ Emulator status
- ✅ Metro bundler status
- ⚠ Recent errors (if any)

### Extract Detailed Errors

```cmd
node extract-errors.js
```

**Provides:**
- Detailed error analysis
- Stack traces
- Recent logcat entries

---

## 🎯 Recommended Workflow

### For Regular Development:

1. **Terminal 1:** Run `quick-start.bat`
   - Launches everything automatically
   - Keep this running (Metro bundler)

2. **Terminal 2:** Run `monitor-app.bat`
   - Watch for errors in real-time
   - See structured error logs

3. **Edit code** in your editor
   - Changes hot-reload automatically
   - Errors appear immediately in Terminal 2

4. **Check status** when needed: `check-app-status.bat`

### For Claude's Autonomous Testing:

Claude can now work autonomously by:

1. Running `./check-app-status.sh` to verify environment
2. Starting `./monitor-app.sh` in background via Bash tool
3. Reading output with BashOutput tool
4. Making code changes
5. Verifying fixes automatically

See [CLAUDE-AUTONOMOUS-TESTING.md](./CLAUDE-AUTONOMOUS-TESTING.md) for full details.

---

## 📱 Available Emulators

To see what emulators you have:

```cmd
list-emulators.bat
```

To use a different emulator:

```cmd
launch-emulator.bat [emulator-name]
```

---

## ⚙️ Android SDK Setup

Your Android SDK should be at:
```
D:\Android\Sdk
```

Make sure these are installed (via Android Studio SDK Manager):
- ✅ Android SDK Platform-Tools
- ✅ Android SDK Build-Tools
- ✅ Android Emulator
- ✅ At least one system image (e.g., API 33 or 36)

---

## 🛠️ Creating a New Emulator

If you don't have `Medium_Phone_API_36.1` or want to create a new one:

1. **Open Android Studio**
2. **Tools** → **Device Manager**
3. **Create Device** (+ button)
4. Choose a device definition:
   - Recommended: **Pixel 5** or **Medium Phone**
5. Choose a system image:
   - Recommended: **API 33** (Android 13) or **API 36** (Android 15)
   - Download if needed
6. **Finish** setup
7. Your new emulator will appear in the list

Then update `launch-emulator.bat` line 39 to use your emulator name.

---

## ❓ Troubleshooting

### "ADB not found"
- Install Android SDK Platform-Tools
- Add to PATH: `D:\Android\Sdk\platform-tools`

### "Emulator not found"
- Install Android Emulator via Android Studio SDK Manager
- Add to PATH: `D:\Android\Sdk\emulator`

### "No emulators available"
- Create one in Android Studio (see above)
- Or run `list-emulators.bat` to see available ones

### "Emulator starts but app doesn't install"
- Wait longer - first install can take 1-2 minutes
- Check Metro bundler output for errors
- Try `npm run android` again

### "Metro bundler port already in use"
- Kill existing Metro: Press Ctrl+C in the Metro terminal
- Or kill manually: `npx react-native start --reset-cache`

---

## 📚 More Resources

- **Full Developer Guide:** [README.md](./README.md)
- **Debugging Guide:** [DEBUGGING-GUIDE.md](./DEBUGGING-GUIDE.md)
- **Claude Testing Guide:** [CLAUDE-AUTONOMOUS-TESTING.md](./CLAUDE-AUTONOMOUS-TESTING.md)

---

**Pro Tip:** Once your emulator is running, you can leave it running between sessions! Just run `start-android.bat` or `npm run android` to launch the app without waiting for emulator boot.

🎉 **You're all set! Happy coding!**
