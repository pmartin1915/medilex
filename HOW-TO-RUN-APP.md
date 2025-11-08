# 🎯 How to Run Your Healthcare Vocab App

## ✅ What Got Fixed

You were experiencing these issues:
- ❌ `quick-start.bat` opened emulator but didn't launch Expo
- ❌ ADB showing "device offline" errors
- ❌ `start-android.bat` giving "cannot find path" error when pressing 'a'
- ❌ Expo app showing "something went wrong"

**All fixed!** Here's what changed:

### Quick-Start Improvements:
1. ✅ Now resets ADB connection **twice** (at start and after emulator boots)
2. ✅ Waits for package manager to be fully ready
3. ✅ Uses `npx expo start --android` to launch directly on Android
4. ✅ Better progress indicators so you know what's happening
5. ✅ Changed from 4 steps to 6 steps with proper stabilization

### Start-Android Improvements:
1. ✅ Changed from `npx expo start` (which opens menu) to `npx expo start --android` (which launches directly)
2. ✅ No more "press 'a' to open Android" - it happens automatically
3. ✅ Clearer instructions

---

## 🚀 Method 1: Quick Start (Recommended!)

**Use this when:** Starting from scratch or emulator is not running.

### Step-by-Step:

1. **Open PowerShell** in your project directory:
   ```powershell
   cd D:\Medilex\HealthcareVocabApp
   ```

2. **Run quick-start:**
   ```powershell
   .\quick-start.bat
   ```

3. **Watch the progress:**
   - [1/6] Resetting ADB... (3 seconds)
   - [2/6] Checking for emulator... (auto-detects if running)
   - [3/6] Starting emulator... (if needed - 20-30 seconds)
   - [4/6] Waiting for boot... (30-60 seconds - you'll see Android animation)
   - [5/6] Stabilizing connection... (15 seconds - **fixes "offline" errors**)
   - [6/6] Starting app... (Metro bundler launches)

4. **What you'll see in the emulator:**
   - Android home screen appears
   - "Building JavaScript bundle..." in terminal
   - App installs automatically
   - App opens!

### ⏱️ **Total Time:**
- **First time:** 2-3 minutes (includes emulator boot + initial build)
- **Subsequent runs:** 30-60 seconds (if emulator already running)

---

## 🔄 Method 2: Manual Two-Step

**Use this when:** You want more control or are debugging.

### Step 1: Launch Emulator

```powershell
.\launch-emulator.bat
```

**Wait until:**
- Emulator window shows the Android home screen
- You can swipe and see apps

### Step 2: Start the App

```powershell
.\start-android.bat
```

**What happens:**
- Resets ADB connection
- Verifies emulator is ready
- Tests package manager
- Launches Metro bundler
- Installs and opens app automatically

---

## 🐛 Troubleshooting

### "Device offline" Error

**Fixed!** The new scripts reset ADB connection twice to prevent this. But if you still see it:

```powershell
adb kill-server
timeout /t 2
adb start-server
```

Then run `.\quick-start.bat` again.

---

### "Package manager not responding"

**Cause:** Emulator not fully booted yet.

**Solution:**
1. Wait until you see the Android home screen
2. Wait an extra 10 seconds
3. Then run `.\start-android.bat`

---

### "Something went wrong" in Expo App

**Don't use the Expo Go app!**

Your app launches **directly** as a standalone app, not through Expo Go. You should see "HealthcareVocabApp" installing and opening automatically.

---

### Emulator Won't Start

**Check:**
1. Android Studio is installed
2. You have an AVD named `Medium_Phone_API_36.1`

**To see your AVDs:**
```powershell
.\list-emulators.bat
```

**To use a different emulator:**
```powershell
.\launch-emulator.bat YourEmulatorName
```

---

###Metro Port Already in Use

**If Metro bundler says port 8081 is busy:**

```powershell
# Kill any existing Metro process
npx expo start --clear

# Or manually kill the port (if needed):
netstat -ano | findstr :8081
# Note the PID, then:
taskkill /PID [the_pid_number] /F
```

---

## 📊 Monitoring Errors (Optional)

Want to see errors in real-time? Open a **second PowerShell terminal:**

```powershell
cd D:\Medilex\HealthcareVocabApp
.\monitor-app.bat
```

**You'll see:**
- Live Android logcat
- Errors with `🏥 [VOCAB_APP_ERROR]` prefix
- React Native JavaScript errors
- Crash reports

---

## ✅ How to Verify Everything Works

### 1. Check Emulator is Running

```powershell
adb devices
```

**Should show:**
```
List of devices attached
emulator-5554   device
```

Note: "device" (not "offline") is good!

### 2. Check App is Installed

After running quick-start and seeing the app, look for the "HealthcareVocabApp" icon on the emulator's app drawer.

### 3. Test the App

- Swipe through flashcards
- Navigate between tabs (Home, Learn, Library, Progress, Debug)
- Check the Debug tab - should show no errors (or any errors that occurred)

---

## 🎯 The Organized Workflow

**For daily development:**

1. **Morning startup:**
   ```powershell
   .\quick-start.bat
   ```
   Leave the emulator running all day!

2. **Making code changes:**
   - Edit files in VS Code
   - Save
   - Metro bundler hot-reloads automatically
   - Changes appear in 2-3 seconds

3. **If you break something:**
   - Check Terminal 1 (Metro bundler) for errors
   - Check Terminal 2 (`monitor-app.bat`) for detailed errors
   - Fix the code
   - Save
   - App reloads automatically

4. **End of day:**
   - Press Ctrl+C in Metro terminal
   - Close emulator window

---

## 🔁 Quick Reference

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `.\quick-start.bat` | Everything in one command | Start of session |
| `.\launch-emulator.bat` | Just start emulator | Manual control |
| `.\start-android.bat` | Just start app (assumes emulator running) | Restart app |
| `.\monitor-app.bat` | Watch errors in real-time | Debugging |
| `.\check-app-status.bat` | Quick health check | Verify setup |
| `.\list-emulators.bat` | Show available AVDs | Check emulators |

---

## 🎉 You're All Set!

The fixes I made should resolve all the issues you were experiencing.

**Next time, just run:**
```powershell
.\quick-start.bat
```

And everything will work smoothly!

**Questions?** Let me know which step gives you trouble and I'll help debug.
