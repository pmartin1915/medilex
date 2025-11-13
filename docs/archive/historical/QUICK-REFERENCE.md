# 🚀 Quick Reference - Healthcare Vocab App

**ONE command to remember:** `.\launch.bat`

---

## ⚡ Most Common Commands (Top 5)

### 1. Master Launcher (Use This!)
```powershell
.\launch.bat
```
**Interactive menu for everything** - testing, dev, git, troubleshooting

---

### 2. Test on Web (Fastest)
```powershell
.\quick-verify.bat
```
- Opens checklist + browser automatically
- Side-by-side verification
- **Use this first** when testing changes

---

### 3. Test on iOS (iPhone)
```powershell
.\quick-verify-ios.bat
```
- Opens checklist + QR code in Metro window
- Scan with Expo Go app
- **Requires:** iPhone + Expo Go + same WiFi

---

### 4. Start Development Server
```powershell
.\start-mobile.bat
```
- Shows QR code for all devices
- Works for iOS and Android
- **Daily dev use**

---

### 5. Sync with Git
```powershell
.\sync-with-git.bat
```
- Auto pull + push
- Resolves conflicts automatically
- **Use before/after coding sessions**

---

## 📋 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **QR code won't scan** | Check same WiFi, restart Metro |
| **App shows old code** | Close Expo Go completely, rescan QR |
| **Metro won't start** | Kill port 8081: `netstat -ano \| findstr :8081` then `taskkill /F /PID [number]` |
| **Strange errors** | Run `.\clear-cache.bat` then restart |
| **Emulator issues** | Run `.\troubleshoot.bat` → choose your issue |

---

## 🎯 Common Workflows

### Morning Startup
```powershell
.\launch.bat
# Choose option 5 (Dev Server)
# Leave running all day
```

### After Code Changes
```powershell
.\quick-verify.bat  # Test on web first
.\quick-verify-ios.bat  # Then test on iPhone
```

### Before Pushing to Git
```powershell
.\quick-verify-all.bat  # Test all platforms
.\sync-with-git.bat  # Push changes
```

### When Debugging
```powershell
# Terminal 1:
.\start-mobile.bat

# Terminal 2:
.\monitor-app.bat  # Watch for errors
```

---

## 📱 Platform-Specific

### Web Testing
- **Quick:** `.\quick-verify.bat`
- **Manual:** `.\test-web.bat`
- Opens browser automatically at http://localhost:8081

### iOS Testing
- **Quick:** `.\quick-verify-ios.bat`
- **Manual:** `.\test-ios.bat`
- Need Expo Go app from App Store
- Scan QR code in Metro window

### Android Testing
- **Quick:** `.\quick-start.bat`
- **Manual:** `.\start-android.bat`
- Launches emulator automatically

### All Platforms
- **Quick:** `.\quick-verify-all.bat`
- Tests web + iOS + Android simultaneously

---

## 🔧 Other Useful Commands

```powershell
# Clear all caches
.\clear-cache.bat

# Monitor errors in real-time
.\monitor-app.bat

# Interactive troubleshooting
.\troubleshoot.bat

# Check app status
.\check-app-status.bat

# List Android emulators
.\list-emulators.bat
```

---

## 📚 Documentation Links

- **Getting Started:** [START-HERE.md](START-HERE.md)
- **Full Testing Guide:** [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md)
- **iOS Specific:** [iOS-VERIFICATION-GUIDE.md](iOS-VERIFICATION-GUIDE.md)
- **For AI Sessions:** [HANDOFF.md](HANDOFF.md)
- **Troubleshooting:** [HOW-TO-RUN-APP.md](HOW-TO-RUN-APP.md)

---

## 💡 Pro Tips

1. **Use `launch.bat` for everything** - it's the master control center
2. **Test on web first** - fastest feedback loop
3. **Keep emulator running** - saves startup time
4. **Two terminals** - one for Metro, one for monitoring
5. **Sync often** - `.\sync-with-git.bat` before and after sessions

---

## 🆘 Need Help?

1. **Run:** `.\launch.bat` → Option 9 (Troubleshoot)
2. **Check:** [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md) for platform-specific issues
3. **Ask:** Claude Code can help debug any errors!

---

**Remember: `.\launch.bat` is your friend!** 🚀

**Last Updated:** 2025-11-09
