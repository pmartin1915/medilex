# 🎯 START HERE - Healthcare Vocab App

**You're in the right place!** This guide tells you exactly what to do.

---

## ⚡ QUICKEST START (NEW!)

**ONE command for everything:**

```powershell
.\launch.bat
```

This opens an **interactive menu** where you can:
- Test on Web, iOS, or Android
- Start development server
- Monitor errors
- Sync with Git
- Troubleshoot issues

**This is the easiest way to use the app!**

For a quick cheat sheet, see: **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)**

---

## 🚀 Most Common Tasks

### Test on Web (Fastest!)
```powershell
.\quick-verify.bat
```
- Opens verification checklist + browser
- Side-by-side testing
- Perfect for quick checks after code changes

### Test on iOS (iPhone)
```powershell
.\quick-verify-ios.bat
```
- Opens verification checklist + QR code
- Scan with Expo Go app
- **Requires:** Expo Go from App Store + same WiFi

### Test on Android (Emulator)
```powershell
.\quick-start.bat
```
- Launches emulator automatically
- Installs and runs app
- **First time:** 2-3 minutes. **After:** 30-60 seconds

### Test ALL Platforms
```powershell
.\quick-verify-all.bat
```
- Tests web + iOS + Android simultaneously
- Perfect before pushing code

### Start Development Server
```powershell
.\start-mobile.bat
```
- Shows QR code for any device
- Use daily for development
- Hot reload works automatically

---

## 📋 Quick Reference

| What You Want | Command | When to Use |
|---------------|---------|-------------|
| **Interactive menu (BEST!)** | `.\launch.bat` | Everything! |
| **Test on web** | `.\quick-verify.bat` | After code changes |
| **Test on iPhone** | `.\quick-verify-ios.bat` | iOS testing |
| **Test on Android** | `.\quick-start.bat` | Android emulator |
| **Test all platforms** | `.\quick-verify-all.bat` | Before pushing |
| **Daily development** | `.\start-mobile.bat` | Dev server |
| **Watch for errors** | `.\monitor-app.bat` | Debugging |
| **Sync with Git** | `.\sync-with-git.bat` | Pull/push code |

---

## 🔄 Typical Workflow

### Morning Startup
```powershell
.\launch.bat
# Choose option 5 (Dev Server)
# Leave this running all day
```

### After Making Code Changes
```powershell
# Quick test on web first:
.\quick-verify.bat

# Then test on iPhone:
.\quick-verify-ios.bat
```

### Before Pushing to Git
```powershell
# Test all platforms:
.\quick-verify-all.bat

# Sync with Git:
.\sync-with-git.bat
```

### When Debugging
```powershell
# Terminal 1:
.\start-mobile.bat

# Terminal 2:
.\monitor-app.bat
# Watch for errors with 🏥 prefix
```

---

## 📚 Documentation Guide

| File | What's In It | When to Read It |
|------|-------------|-----------------|
| **[START-HERE.md](START-HERE.md)** | 🎯 **YOU ARE HERE** - Main entry point | Start here! |
| **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** | ⚡ Top 5 commands + quick troubleshooting | Keep this handy! |
| **[VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md)** | ✅ Complete testing checklist (all platforms) | When verifying app |
| **[iOS-VERIFICATION-GUIDE.md](iOS-VERIFICATION-GUIDE.md)** | 📱 iOS-specific testing guide | Testing on iPhone |
| **[HANDOFF.md](HANDOFF.md)** | 🤖 Current state + AI session notes | For Claude Code |
| **[HOW-TO-RUN-APP.md](HOW-TO-RUN-APP.md)** | 📖 Detailed troubleshooting | Having problems? |
| **[README.md](README.md)** | 📋 Project overview + features | Learn about the app |

---

## ❓ Troubleshooting

### QR Code Won't Scan
- Ensure iPhone and PC on same WiFi network
- Try `.\clear-cache.bat` then restart Metro

### App Shows Old Code
- Close Expo Go completely (swipe up in app switcher)
- Restart Expo Go and scan QR again

### Metro Won't Start
```powershell
# Find and kill the process on port 8081:
netstat -ano | findstr :8081
taskkill /F /PID [the_number_you_see]

# Then restart:
.\launch.bat
```

### Strange Errors
```powershell
# Clear all caches:
.\clear-cache.bat

# Then restart Metro
```

### More Issues
```powershell
# Interactive troubleshooting menu:
.\troubleshoot.bat

# Or use master launcher:
.\launch.bat
# Choose option 9 (Troubleshoot)
```

---

## 🎯 Your Next Steps

**Right Now:**
1. Close this file
2. Open PowerShell in `D:\Medilex\HealthcareVocabApp`
3. Run: `.\launch.bat`
4. Choose what you want to do!

**For Quick Testing:**
```powershell
.\quick-verify.bat  # Test on web (fastest)
```

**For Daily Development:**
```powershell
.\start-mobile.bat  # Dev server with QR code
```

---

## 💡 Pro Tips

- **Use `launch.bat` for everything** - it's your control center
- **Test on web first** - fastest feedback loop (30 seconds)
- **Keep emulator running** between sessions - saves startup time
- **Two terminals** - one for Metro, one for monitoring errors
- **Sync often** - use `.\sync-with-git.bat` before and after sessions
- **Check [QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - it's your cheat sheet!

---

## 🆘 Need Help?

**For errors:**
1. Run `.\monitor-app.bat` in a second terminal
2. Copy lines with `🏥 [VOCAB_APP_ERROR]`
3. Paste to Claude Code - I'll fix them!

**For questions:**
- Check [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for common commands
- Check [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) for platform-specific issues
- Ask Claude Code - I can help with any problems!

---

**Remember:** `.\launch.bat` is your friend! 🚀

**Happy coding!**
