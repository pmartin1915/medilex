# Troubleshooting Flowchart

## White/Black Screen on Android Emulator

```
START: App shows white/black screen
    |
    v
[1] Did you run clear-cache.bat?
    |
    |-- NO --> Run clear-cache.bat
    |          then npm install
    |          then start-android.bat
    |          GOTO [2]
    |
    |-- YES --> GOTO [2]
    |
    v
[2] Do you see the Startup Loader?
    |
    |-- NO --> Problem: App not loading at all
    |          |
    |          v
    |          Check Metro Bundler terminal:
    |          - Is Metro running?
    |          - Any red errors?
    |          - Did build complete?
    |          |
    |          v
    |          Metro has errors?
    |          |-- YES --> Fix Metro errors first
    |          |           Common fixes:
    |          |           - npm install
    |          |           - clear-cache.bat
    |          |           - Check syntax errors
    |          |
    |          |-- NO --> Check Android connection:
    |                     - Is emulator running?
    |                     - Run: adb devices
    |                     - Restart emulator
    |
    |-- YES --> GOTO [3]
    |
    v
[3] Did all 4 startup steps get green checkmarks?
    |
    |-- NO --> Which step failed?
    |          |
    |          +-- "Initializing Error Logger" failed
    |          |   - Critical system error
    |          |   - Check Metro bundler logs
    |          |   - Verify errorLogger.ts exists
    |          |
    |          +-- "Loading App Data" failed
    |          |   - Problem importing stores
    |          |   - Check wordStore.ts exists
    |          |   - Check streakStore.ts exists
    |          |   - Check for syntax errors
    |          |
    |          +-- "Checking AsyncStorage" failed
    |          |   - AsyncStorage not working
    |          |   - Check emulator storage permissions
    |          |   - Try clearing app data
    |          |   - Check @react-native-async-storage installed
    |          |
    |          +-- "Initializing Navigation" failed
    |              - Navigation libraries missing
    |              - Run: npm install
    |              - Check @react-navigation packages
    |
    |-- YES --> GOTO [4]
    |
    v
[4] App loaded after startup?
    |
    |-- NO --> Still white screen after startup
    |          |
    |          v
    |          Open Debug tab (if possible):
    |          - Press physical back button (may reveal tabs)
    |          - Look for bottom navigation
    |          - Tap Debug (bug icon)
    |          |
    |          v
    |          Can you access Debug tab?
    |          |-- YES --> Check Logs tab
    |          |           - Any errors logged?
    |          |           - Screenshot and report
    |          |
    |          |-- NO --> White screen persists
    |                     |
    |                     v
    |                     Terminal checks:
    |                     1. Metro bundler output
    |                     2. npx react-native log-android
    |                     3. Look for:
    |                        - JavaScript errors
    |                        - Native crashes
    |                        - "FATAL" messages
    |
    |-- YES --> GOTO [5]
    |
    v
[5] App loaded successfully!
    |
    v
    Do you see the Home screen?
    |
    |-- NO --> App loaded but showing wrong screen
    |          |
    |          v
    |          Open Debug tab:
    |          - Check State tab
    |          - Verify "Terms Loaded: 5"
    |          - Check Storage tab
    |          - Verify keys exist
    |
    |-- YES --> SUCCESS! App working
               |
               v
               Final verification:
               - 5 tabs visible?
               - Word of the Day shows?
               - Can navigate between tabs?
               - Debug tab accessible?
               |
               v
               All working? DONE!
               |
               Something not working?
               - Check Debug tab → Logs
               - Look for warnings
               - Test each feature
```

---

## Quick Decision Tree

### Symptom: Nothing shows up

**Check:** Is Metro bundler running?
- **NO** → Start with `start-android.bat`
- **YES** → Continue below

**Check:** Any errors in Metro terminal?
- **YES** → Fix those errors first
- **NO** → Continue below

**Check:** Is emulator running?
- **NO** → Start emulator, then retry
- **YES** → Run `adb devices` to verify connection

---

### Symptom: Startup loader shows, then fails

**Check:** Which step has red X?
- **Step 1** → System error, check Metro logs
- **Step 2** → Store loading error, check files exist
- **Step 3** → AsyncStorage error, clear app data
- **Step 4** → Navigation error, reinstall packages

---

### Symptom: Startup completes, still white screen

**Check:** Can you see bottom tabs?
- **YES** → Tap Debug tab, check logs
- **NO** → Press back button, check for hidden tabs

**Check:** Debug tab shows errors?
- **YES** → Screenshot and analyze
- **NO** → Check State tab for data

---

### Symptom: Random crashes or freezes

**Action:**
1. Open Debug tab
2. Check Logs tab for error before crash
3. Note the error message
4. Check componentStack to see which screen

---

## Emergency Procedures

### Nuclear Option: Full Reset

```bash
# 1. Kill everything
taskkill /F /IM node.exe

# 2. Clear everything
clear-cache.bat

# 3. Delete lock file
del package-lock.json

# 4. Fresh install
npm install

# 5. Clear Expo
npx expo start --clear

# 6. Press 'a' for Android
```

### If Still Failing

1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version` (should be 9+)
3. Check Expo version in package.json (should be ~54.0.0)
4. Verify Android SDK is installed
5. Try different emulator

---

## Log Collection Guide

If you need to report the issue:

### 1. Startup Loader
- Take screenshot of startup screen
- Note which steps passed/failed
- Note exact error message

### 2. Debug Tab - Logs
- Open Debug tab
- Tap Logs
- Screenshot first 3 errors
- Or copy error messages

### 3. Debug Tab - Storage
- Open Debug tab
- Tap Storage
- Count how many keys
- Note if `@vocab_app:*` keys exist

### 4. Debug Tab - State
- Open Debug tab
- Tap State
- Check "Terms Loaded" number
- Screenshot the state info

### 5. Metro Bundler
- Copy the terminal output
- Look for lines starting with:
  - `ERROR`
  - `BUNDLE`
  - `FAILED`

### 6. Android Logcat
```bash
npx react-native log-android > android_logs.txt
```
- Open android_logs.txt
- Search for "ERROR"
- Search for "FATAL"
- Copy relevant sections

---

## Success Indicators

✅ **Startup Loader:**
- Shows 4 steps
- All have green checkmarks
- Completes in 2-3 seconds

✅ **Home Screen:**
- Streak calendar visible
- "Word of the Day" card shows
- Shows "tachycardia" as first term
- "Terms Available: 5"
- Bottom navigation has 5 tabs

✅ **Debug Tab:**
- Opens when tapped
- Shows 3 sub-tabs (Logs, Storage, State)
- Logs shows some info logs
- Storage shows 3+ keys
- State shows "Terms Loaded: 5"

✅ **App Functionality:**
- Can swipe between tabs
- Learn screen works
- Library screen shows terms
- Progress screen loads
- No crashes

---

## Common Error Messages and Fixes

### "Cannot find module 'X'"
**Fix:** `npm install`

### "Metro bundler has encountered an error"
**Fix:** `clear-cache.bat` then restart

### "AsyncStorage test failed"
**Fix:** Clear app data in Android settings

### "Navigation libraries not loaded"
**Fix:** `npm install @react-navigation/native`

### "Global handler error"
**Fix:** Check Debug tab → Logs for actual error

### "Element type is invalid"
**Fix:** Syntax error in components, check Metro logs

---

## Pro Tips

💡 **Always check Debug tab first** - it's your best debugging tool

💡 **Startup loader shows the truth** - trust what it says

💡 **Error logs persist** - even if app crashes, they're saved

💡 **Metro must be running** - white screen often means Metro stopped

💡 **Clear cache fixes 80% of issues** - when in doubt, clear it out

💡 **Emulator must be booted** - start it before running app

💡 **Check for typos** - especially in import statements

💡 **Read the error message** - it usually tells you what's wrong
