# Quick Debugging Guide

## TL;DR - How to See Errors on Android Emulator

**The easiest way: Use the Debug Tab in your app!**

1. Open your app on the Android emulator
2. Tap the **Debug** tab (bug icon) at the bottom
3. See all errors with full details
4. **Tap any error to copy it** to clipboard
5. Paste into your laptop notes, messages, etc.

---

## What's New

Your app now has **5 major debugging improvements**:

### 1. Debug Tab with Error Count Badge
- **Red badge** shows number of errors
- Updates every 2 seconds
- Click Debug tab to see all errors

### 2. Enhanced Debug Screen
- **Tap any error to copy** - full details copied to clipboard
- **Copy All button** - copies all errors at once
- **Smart timestamps** - "5m ago", "Just now", etc.
- **3 tabs**: Logs, Storage, State

### 3. Real-Time Error Toasts (DEV mode only)
- Errors pop up as toasts at top of screen
- **Tap toast to jump to Debug tab**
- Auto-dismiss after 5 seconds
- Only shows in development

### 4. Better Metro Bundler
- Enhanced logging in terminal
- Better source maps (preserves function names)
- Clear cache on startup
- Network request logging

### 5. Utility Scripts
- **debug-mode.bat** - Start with all debugging features
- **start-android.bat** - Updated with better logging
- **show-errors.bat** - Quick Metro status check

---

## How to Use

### Starting the App

**Option 1: Enhanced Debug Mode (Recommended)**
```bash
debug-mode.bat
```
This gives you:
- Verbose terminal output
- Clear cache on startup
- All debugging features enabled
- Helpful on-screen instructions

**Option 2: Standard Mode**
```bash
start-android.bat
```
Still includes all app debugging features, less terminal noise.

### Viewing Errors in the App

**The Debug Tab:**
1. Tap **Debug** (bug icon) at bottom
2. See the **Logs** tab (default)
3. Errors are color-coded:
   - **Red border** = Error
   - **Yellow border** = Warning
   - **Blue border** = Info

**Copying Errors:**
- **Tap any error** = Copy that error to clipboard
- **Copy button** (top right) = Copy ALL errors
- Then paste anywhere - messages, notes, email

**Error Toast Notifications:**
- Appear automatically when errors occur
- Only in DEV mode
- Tap to navigate to Debug tab
- Or wait 5 seconds for auto-dismiss

### Checking App State

**Storage Tab:**
- View all AsyncStorage keys
- Tap any key to see its value
- Clear all storage (with confirmation)

**State Tab:**
- See how many terms are loaded
- Check user progress count
- View current streak
- Preview sample terms

---

## Troubleshooting Common Issues

### "I don't see any errors in the terminal"
→ **Use the Debug tab in the app instead!** It's much more reliable for Android.

### "The emulator shows an error but I can't copy it"
→ **Tap the Debug tab** - all errors are logged there with one-tap copy.

### "I want to send error details to my laptop"
→ **Tap the error in Debug tab** to copy, then:
  - Email yourself
  - Message yourself (iMessage, WhatsApp, etc.)
  - Use a note-taking app that syncs

### "Toast notifications aren't showing"
→ They only show in DEV mode when `__DEV__` is true. Production builds won't show toasts.

### "Error count badge not updating"
→ Give it 2 seconds - it polls every 2 seconds for new errors.

---

## What Gets Logged

The error logger captures:
- All `console.error()` calls
- All `console.warn()` calls
- React component errors (via ErrorBoundary)
- Global JavaScript errors
- Unhandled promise rejections

Each log includes:
- **Timestamp** (formatted as "5m ago", etc.)
- **Error type** (error, warn, info)
- **Message**
- **Stack trace** (if available)
- **Component stack** (for React errors)
- **Context** (which part of app logged it)

**Storage:**
- Saved to AsyncStorage
- Persists between app restarts
- Max 50 most recent logs
- Can be cleared from Debug tab

---

## Pro Tips

1. **Start development with debug-mode.bat**
   - Shows helpful reminders
   - Clears cache for clean start
   - Best debugging experience

2. **Check the error badge frequently**
   - Red badge on Debug tab = you have errors
   - Number tells you how many

3. **Use tap-to-copy liberally**
   - Fastest way to get error details off emulator
   - Copies formatted text with full stack traces

4. **Toast notifications are your friend**
   - See errors immediately as they happen
   - Tap to investigate in Debug tab

5. **Keep the Debug tab open while developing**
   - Real-time error monitoring
   - Instant visibility into issues

6. **Clear logs periodically**
   - Use trash icon in Debug tab
   - Keeps error list manageable
   - Start fresh when fixing issues

---

## File Reference

**New Files Created:**
- `src/components/ErrorToast.tsx` - Toast notifications
- `src/utils/errorLogger.ts` - Error logging system
- `debug-mode.bat` - Enhanced debugging launcher
- `show-errors.bat` - Quick error check utility
- `DEBUGGING-GUIDE.md` - This file!

**Modified Files:**
- `App.tsx` - Added toast, error badge, navigation ref
- `src/screens/DebugScreen.tsx` - Copy functionality, better UI
- `start-android.bat` - Better logging
- `metro.config.js` - Source maps, logging
- `README.md` - Debug documentation

---

## Quick Commands

| Command | What It Does |
|---------|-------------|
| `debug-mode.bat` | Start with max debugging (recommended) |
| `start-android.bat` | Standard startup |
| `show-errors.bat` | Check Metro status |
| `npx expo start --clear` | Clear cache manually |

---

## Questions?

**Where are errors stored?**
→ AsyncStorage key: `@vocab_app:error_logs`

**How many errors are kept?**
→ Max 50 most recent

**Do errors persist after app restart?**
→ Yes! Stored in AsyncStorage

**Can I use this in production?**
→ Error logging works, but toasts are DEV-only

**How do I disable the Debug tab in production?**
→ Just don't include it in the Tab.Navigator for production builds

---

## The Bottom Line

**You already built an awesome debugging system!** The Debug tab was already there - I just made it better with:
- One-tap copy to clipboard
- Real-time error badges
- Toast notifications
- Better formatting
- Utility scripts

**No more struggling to copy errors from the emulator!**

Just open the Debug tab and tap to copy. That's it!
