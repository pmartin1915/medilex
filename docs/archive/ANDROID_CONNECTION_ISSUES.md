# Android Connection Issues - Quick Fix

## Error: "Can't find service: package"

This error means the Android emulator isn't fully ready or ADB connection is broken.

---

## 🔧 Quick Fix (Try This First)

### Option 1: Fix ADB Connection
```bash
fix-android-connection.bat
```

This script will:
- Reset ADB server
- Check emulator status
- Tell you if emulator is ready

### Option 2: Manual ADB Reset
```bash
adb kill-server
adb start-server
adb devices
```

### Option 3: Wait and Retry
The emulator might just need more time to boot:
1. Wait 30-60 seconds
2. In the Metro terminal, press `a` again
3. Or restart with `start-android.bat`

---

## 📱 Ensuring Emulator is Ready

### Check if Emulator is Fully Booted

```bash
adb shell getprop sys.boot_completed
```

**Expected output:**
- `1` = Emulator is ready ✅
- `error` or nothing = Emulator still booting ⏳

### Check Connected Devices

```bash
adb devices
```

**Expected output:**
```
List of devices attached
emulator-5554    device
```

**If you see:**
- `offline` = Emulator not ready, wait longer
- `unauthorized` = Accept USB debugging prompt on emulator
- Nothing listed = Emulator not connected

---

## 🚀 Recommended Startup Procedure

### **Best Practice: Start in Order**

1. **Start Android Emulator First**
   - Open Android Studio
   - Click "Device Manager"
   - Click "Run" on your emulator
   - **Wait for home screen to appear** (30-60 seconds)
   - See the Android home screen fully loaded

2. **Verify Connection**
   ```bash
   adb devices
   ```
   - Should show `device` status

3. **Run App**
   ```bash
   start-android.bat
   ```
   - Metro will start
   - Press `a` to open on Android

---

## ⚠️ Common Issues

### Issue: Emulator Shows in List but "offline"

**Solution:**
```bash
adb kill-server
adb start-server
adb devices
```

### Issue: No Devices Listed

**Solution:**
1. Check if emulator is actually running (visible window)
2. Wait 30 more seconds for boot
3. Try: `adb devices` again

### Issue: Multiple Emulators Running

**Solution:**
```bash
# List all
adb devices

# Kill all emulators
adb -s emulator-5554 emu kill
adb -s emulator-5556 emu kill

# Start fresh with just one
```

### Issue: ADB Not Found

**Solution:**
Check ANDROID_HOME is set:
```bash
echo %ANDROID_HOME%
```
Should show: `D:\Android\Sdk`

If not, add to system environment variables.

---

## 🔄 Complete Reset Procedure

If nothing works, do this:

```bash
# 1. Close all emulators
# (Close emulator window)

# 2. Kill ADB
adb kill-server

# 3. Clear Expo cache
clear-cache.bat

# 4. Reinstall dependencies
npm install

# 5. Start fresh
# Open Android Studio → Start Emulator
# Wait for fully booted (home screen visible)

# 6. Verify connection
adb devices

# 7. Start app
start-android.bat

# 8. Press 'a' when Metro starts
```

---

## 🎯 Metro Terminal Commands

Once Metro is running, you can use these commands:

- **Press `a`** - Open on Android (retry connection)
- **Press `r`** - Reload app
- **Press `j`** - Open Chrome debugger
- **Press `m`** - Toggle developer menu
- **Press `?`** - Show all commands
- **Ctrl+C** - Stop Metro

If you see the error, just **press `a` again** after waiting a moment.

---

## 📋 Diagnostic Checklist

Before reporting issues, check:

- [ ] Emulator window is open and showing Android home screen
- [ ] `adb devices` shows device as `device` (not offline)
- [ ] `adb shell getprop sys.boot_completed` returns `1`
- [ ] Metro bundler is running (should see terminal output)
- [ ] No firewall blocking localhost:8081
- [ ] Android SDK installed at `D:\Android\Sdk`

---

## 🆘 Advanced Debugging

### Check Emulator Network

```bash
adb shell ping -c 4 8.8.8.8
```

Should show successful pings.

### Check Metro Accessibility from Emulator

```bash
adb shell curl http://10.0.2.2:8081/status
```

Should return bundle status.

### View Full Emulator System Log

```bash
adb logcat | findstr "Error"
```

Look for package manager errors.

### Restart Package Manager Service

```bash
adb shell pm path android
```

Should return path. If error, emulator needs restart.

---

## 💡 Pro Tips

**Tip 1:** Always start emulator before Metro
- Emulator takes 30-60 seconds to fully boot
- Metro expects emulator to be ready

**Tip 2:** Use `adb devices` as your health check
- Quick way to verify connection
- Should always show `device` status

**Tip 3:** When in doubt, restart ADB
- `fix-android-connection.bat` does this for you
- Solves 90% of connection issues

**Tip 4:** One emulator at a time
- Multiple emulators can cause conflicts
- Keep it simple with one

**Tip 5:** Wait for full boot
- Don't rush it
- Android home screen = ready to go

---

## ✅ Success Indicators

**Emulator is ready when:**
- ✓ Home screen fully visible
- ✓ Clock showing on status bar
- ✓ No boot animation
- ✓ `adb devices` shows `device`
- ✓ `adb shell getprop sys.boot_completed` returns `1`

**App connection successful when:**
- ✓ Metro shows "Opening on Android..."
- ✓ No "Can't find service" error
- ✓ App launches on emulator
- ✓ Shows startup loader (our new feature!)

---

## 🔍 Understanding the Error

**"Can't find service: package"** means:
- Android's package manager service isn't responding
- Usually means system isn't fully booted
- Or ADB daemon crashed and needs restart

**It's usually NOT:**
- A problem with your code
- A problem with Expo
- A permanent issue

**It's usually:**
- Timing issue (emulator not ready)
- ADB connection glitch (restart fixes it)
- Multiple processes conflicting

---

## 📞 If Still Stuck

Try this sequence:

1. **Close everything**
   - Close Metro terminal (Ctrl+C)
   - Close emulator window
   - Close Android Studio

2. **Wait 10 seconds**

3. **Open Android Studio**
   - Start emulator
   - Watch it boot completely
   - See home screen

4. **Run fix script**
   ```bash
   fix-android-connection.bat
   ```

5. **Verify ready**
   - Should see `1` at the end
   - Should see device listed

6. **Start app**
   ```bash
   start-android.bat
   ```

7. **Press `a`** when Metro is ready

If this still fails, the emulator itself may need to be recreated in Android Studio.
