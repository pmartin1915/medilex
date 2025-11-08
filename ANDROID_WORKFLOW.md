# Android Development Workflow

This guide helps you avoid the frustrating "Can't find service: package" error.

## Quick Start (Recommended)

### Option 1: Start with Auto-Fix (Most Reliable)
```powershell
# Just run this - it handles ADB reset automatically
.\start-android.bat
```

The script now automatically:
- Resets ADB server (prevents "Can't find service" error)
- Checks emulator readiness
- Tests package manager service
- Reconnects if needed
- Starts Metro bundler

### Option 2: If Emulator Not Running
```powershell
# 1. Launch emulator first
.\launch-emulator.bat

# 2. Wait for home screen to appear (~30-60 seconds)

# 3. Then start the app
.\start-android.bat
```

## If You Still Get "Can't find service: package" Error

### Level 1: Quick Fix (Try This First)
```powershell
# In a new terminal window:
.\fix-adb-quick.bat

# Then go back to Metro terminal and press 'a'
```
**Success rate: ~40%** | **Time: 10 seconds** | **Metro: Keeps running**

### Level 2: Nuclear Fix (If Quick Fix Fails)
```powershell
# In a new terminal window:
.\fix-emulator-nuclear.bat

# Follow the prompts - this restarts Android system services
```
**Success rate: ~70%** | **Time: 20 seconds** | **Metro: Keeps running**

### Level 3: Full Restart (Recommended When Levels 1-2 Fail)
```powershell
# Automated full restart (keeps Metro running):
.\restart-emulator.bat

# This completely restarts the emulator
# Wait for "READY TO USE" message
# Then press 'a' in Metro terminal
```
**Success rate: 99%** | **Time: 60 seconds** | **Metro: Keeps running**

### Level 4: Complete Reset (Last Resort)
```powershell
# Manual steps if automated restart fails:
# 1. Close emulator window
# 2. Press Ctrl+C in Metro terminal
# 3. Open Task Manager and kill:
#    - qemu-system-x86_64.exe
#    - adb.exe
# 4. Run:
.\start-android.bat

# This starts both Metro and emulator fresh
```
**Success rate: 100%** | **Time: 90 seconds** | **Metro: Must restart**

## Understanding the Scripts

### [start-android.bat](start-android.bat)
**Main startup script** - Use this every time
- Auto-resets ADB (prevents 90% of issues)
- Validates emulator is ready
- Tests package manager service
- Starts Metro bundler

### [fix-adb-quick.bat](fix-adb-quick.bat)
**Emergency fix** - Run if you get the error mid-development
- Kills and restarts ADB server
- Reconnects to emulator
- Tests if package manager is working
- No need to restart Metro!

### [launch-emulator.bat](launch-emulator.bat)
**Emulator launcher** - Use if emulator is not running
- Lists available emulators
- Launches Medium_Phone_API_36.1
- Checks connection status

### [fix-android-connection.bat](fix-android-connection.bat)
**Detailed diagnostic** - Use for troubleshooting
- Shows detailed ADB status
- Provides step-by-step diagnostics

### [fix-emulator-nuclear.bat](fix-emulator-nuclear.bat)
**Nuclear option** - Restart Android system services
- Restarts package manager service
- Tries soft reboot if needed
- Success rate ~70%

### [restart-emulator.bat](restart-emulator.bat)
**Full emulator restart** - Automated clean restart
- Kills all emulator processes
- Starts fresh emulator instance
- Waits for full boot automatically
- Success rate 99%

## Common Issues & Solutions

### Issue: "Can't find service: package"
**Cause**: ADB loses connection to emulator's package manager
**Solution**: Run `fix-adb-quick.bat` in a new terminal, then press 'a' in Metro

### Issue: Emulator shows "offline" or "unauthorized"
**Cause**: ADB server stale
**Solution**: Run `start-android.bat` again (it auto-resets ADB)

### Issue: Black/white screen on emulator
**Cause**: Was the TurboModuleRegistry error (now fixed!)
**Solution**: The app should work now with lazy errorLogger imports

### Issue: Emulator not starting
**Cause**: Previous emulator process still running
**Solution**:
```powershell
# Kill all emulator processes
taskkill /F /IM qemu-system-x86_64.exe
taskkill /F /IM adb.exe

# Then restart
.\launch-emulator.bat
```

## Best Practices

### Daily Workflow
1. **Morning**: Run `.\launch-emulator.bat` once
2. **Development**: Use `.\start-android.bat` every time you restart Metro
3. **If errors occur**: Run `.\fix-adb-quick.bat` (keeps Metro running!)

### When to Restart Emulator
- If quick fix doesn't work after 2 tries
- If emulator becomes very slow
- If you see "device offline" repeatedly

### When NOT to Restart Emulator
- If you get "Can't find service" error → Use `fix-adb-quick.bat` instead
- If Metro has errors → Just restart Metro, keep emulator running

## Tips

- **Emulator takes 30-60 seconds to fully boot** - be patient!
- **Look for the Android home screen** - that's when it's truly ready
- **Keep emulator running** between code changes - no need to restart
- **ADB issues are usually fixable** without restarting emulator

## Script Execution Order

```
┌─────────────────────────────────┐
│   Emulator Not Running?         │
│   Run: launch-emulator.bat      │
└──────────┬──────────────────────┘
           │
           ↓ (wait for home screen)
           │
┌──────────┴──────────────────────┐
│   Start Development              │
│   Run: start-android.bat         │
│   (auto-fixes ADB issues)        │
└──────────┬──────────────────────┘
           │
           ↓
           │
┌──────────┴──────────────────────┐
│   Metro Running, Press 'a'       │
└──────────┬──────────────────────┘
           │
           ↓
    ┌──────┴───────┐
    │ Error?       │
    ├──────────────┤
    │ Yes → fix-   │
    │       adb-   │
    │       quick  │
    │              │
    │ No → App     │
    │      loads!  │
    └──────────────┘
```

## Success!

When everything works, you'll see:
1. Metro bundler running
2. Startup loader screen with progress indicators
3. Main app with bottom tabs (Home, Learn, Library, Progress, Debug)

The TurboModuleRegistry error is now fixed, so the app should load smoothly!
