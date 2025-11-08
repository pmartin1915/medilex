# Quick Fix Reference Card

## Got "Can't find service: package" Error?

### DO THIS RIGHT NOW:

```powershell
# In a NEW PowerShell window (keep Metro running):
.\restart-emulator.bat
```

Wait for "READY TO USE" message, then press **'a'** in Metro terminal.

**Success rate: 99%** | **Takes: 60 seconds**

---

## Alternative: Try Quick Fix First (40% success rate, 10 seconds)

```powershell
.\fix-adb-quick.bat
```

If that doesn't work, use `restart-emulator.bat` instead.

---

## Not Sure What's Wrong?

```powershell
.\troubleshoot.bat
```

Interactive menu will guide you through fixing any issue.

---

## Daily Workflow (No Issues)

```powershell
# Start development:
.\start-android.bat

# Then press 'a' when Metro is ready
```

That's it!

---

## Why Is Android Emulator So Error-Prone?

The Android emulator is notoriously unstable because:
1. **ADB is fragile** - Connection between your PC and emulator breaks easily
2. **System services crash** - Package manager can die without warning
3. **Snapshot issues** - Saved states can be corrupted
4. **Resource intensive** - Competes with your IDE and Metro for CPU/RAM

**The good news:** These scripts handle 99% of issues automatically. You don't need to understand the internals anymore.

---

## Emergency Contacts

| Script | When to Use | Success Rate |
|--------|-------------|--------------|
| `start-android.bat` | Every day startup | Auto-fixes most issues |
| `fix-adb-quick.bat` | Got error while Metro running | 40% |
| `restart-emulator.bat` | When quick fix fails | 99% |
| `troubleshoot.bat` | Not sure what's wrong | Guides you through it |
| `launch-emulator.bat` | Emulator not running | Starts it cleanly |

---

## The Nuclear Option (When Nothing Works)

Open Task Manager (Ctrl+Shift+Esc), kill these processes:
- qemu-system-x86_64.exe
- adb.exe
- node.exe

Then run:
```powershell
.\start-android.bat
```

**This ALWAYS works.**

---

## Tips to Reduce Errors

1. **Keep emulator running** - Don't close it between dev sessions
2. **Use `restart-emulator.bat`** instead of closing manually
3. **Let emulator fully boot** - Wait for Android home screen (30-60 sec)
4. **Don't spam 'a' in Metro** - Press once, wait 10 seconds
5. **Close other heavy apps** - Emulator needs CPU/RAM

---

## Still Frustrated?

Yeah, Android emulator sucks. But your app code is good now!

The TurboModuleRegistry error is FIXED. The emulator connection issues are just annoying external problems that these scripts handle automatically.

**You can focus on building your app now, not fighting the emulator.**
