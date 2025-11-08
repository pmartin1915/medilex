# Fix TurboModuleRegistry Error

## Error You're Seeing

```
Invariant Violation: TurboModuleRegistry.getEnforcing(...):
'PlatformConstants' could not be found.
```

**On iOS:** This error appears
**On Android:** Smudged/strange screen, unresponsive

---

## 🎯 Root Cause

The error occurs because native modules aren't loading correctly. This happened after we made configuration changes. I've now fixed the errorLogger to handle this more gracefully.

---

## ✅ The Fix (3 Steps)

### **Step 1: Stop Metro**

In your Metro terminal, press:
```
Ctrl+C
```

### **Step 2: Clear Everything**

Run:
```powershell
.\clear-cache.bat
```

Then:
```powershell
npm install
```

### **Step 3: Start Fresh with Cleared Cache**

Run:
```powershell
npx expo start --clear
```

When Metro starts, press:
- **`a`** for Android
- **`i`** for iOS (if you have Xcode)

---

## 🔧 What I Just Fixed

I updated two files to make them more resilient:

### 1. **errorLogger.ts**
- Now safely checks if `ErrorUtils` exists before using it
- Won't crash if native modules aren't ready yet
- Gracefully falls back if unavailable

### 2. Ready to Test

The app should now:
- Not crash with TurboModule errors
- Show startup diagnostics properly
- Handle module loading more gracefully

---

## 📱 Expected Behavior After Fix

**On Android:**
1. Startup loader appears
2. Shows "Healthcare Vocab App"
3. 4 initialization steps with checkmarks
4. Home screen loads with streak calendar

**On iOS (if you have Xcode):**
1. Same startup sequence
2. All features working

---

## 🚀 Full Restart Procedure

If you still have issues after the 3 steps above:

```powershell
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Clear everything
.\clear-cache.bat

# 3. Delete package lock
Remove-Item package-lock.json

# 4. Fresh install
npm install

# 5. Start completely fresh
npx expo start --clear

# 6. Press 'a' for Android or 'i' for iOS
```

---

## 🔍 If Error Persists

### Check 1: Expo SDK Version

```powershell
npx expo --version
```

Should be around `~51.0.0` or similar.

### Check 2: Expo Go App

Make sure Expo Go app is updated on your device/emulator:
- Open Expo Go
- Check for updates in app store

### Check 3: Node Version

```powershell
node --version
```

Should be `v18` or higher.

---

## 📊 Debugging Info

After running `npx expo start --clear`:

**Watch Metro output for:**
- ✓ "Built bundle successfully"
- ✓ "Running app on Android"

**Watch app for:**
- ✓ Startup loader appears
- ✓ Steps complete with checkmarks
- ✓ Home screen loads

**If you see errors:**
- Check Debug tab in app
- Look at Logs section
- Report what you see

---

## 💡 Why This Happened

The `TurboModuleRegistry` error occurs when:
1. Code tries to access native modules too early
2. Native bridge isn't fully initialized
3. Module isn't properly linked (rare with Expo)

Our errorLogger was trying to access `ErrorUtils` (a native module) at import time, before React Native was ready. I've now fixed it to:
- Check if ErrorUtils exists first
- Wrap in try-catch
- Gracefully skip if not available

---

## ✅ Prevention

To avoid this in the future:
- Always use `npx expo start --clear` after config changes
- Clear cache when encountering strange errors
- Don't access native modules at top level of files

---

## 🆘 Still Not Working?

If after following all steps you still see the error:

1. **Restart emulator** completely
2. **Close Android Studio / Xcode**
3. **Restart your computer** (sometimes necessary for ADB)
4. **Try again** with the 3-step fix above

If STILL not working, it might be an Expo SDK version issue. Let me know and we can investigate further!
