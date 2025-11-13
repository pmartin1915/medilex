# iOS Quick Verification Guide

**Last Updated:** 2025-11-09

---

## 🚀 Quick Start - iOS Testing

### Option 1: Quick Verify (RECOMMENDED)
```powershell
.\quick-verify-ios.bat
```

**What it does:**
1. Opens VERIFICATION-CHECKLIST.md in your text editor
2. Clears Metro cache
3. Starts Metro bundler
4. Shows QR code for Expo Go
5. Displays iOS-specific checklist in terminal

**Perfect for:**
- Quick testing after making code changes
- Side-by-side verification (checklist + iPhone)
- First-time testing on iOS

---

### Option 2: Test All Platforms
```powershell
.\quick-verify-all.bat
```

**What it does:**
1. Opens checklist ONCE
2. Starts Metro for all platforms
3. Opens web browser automatically
4. Shows QR code for iOS/Android
5. Lets you test everything at once

**Perfect for:**
- Final verification before pushing
- Testing consistency across platforms
- Comprehensive testing sessions

---

### Option 3: Automated iOS Test
```powershell
.\test-ios.bat
```

**What it does:**
1. Clears Metro cache
2. Starts Expo with iOS focus
3. Shows detailed iOS checklist in terminal
4. No checklist file opened (all in terminal)

**Perfect for:**
- Quick terminal-only testing
- When you already know the checklist
- Automated workflows

---

## 📱 Setup Requirements

### Physical iPhone (Most Common)
1. **Install Expo Go** from the App Store
2. **Same WiFi** - Ensure iPhone and PC are on the same WiFi network
3. **QR Code** - Open Expo Go and tap "Scan QR code"

### iOS Simulator (Mac Only)
1. **Install Xcode** on macOS
2. **Install iOS Simulator** via Xcode
3. **Launch** - Press `i` in Metro terminal or run manually
4. **Note:** Windows cannot run iOS Simulator

---

## ✅ iOS Verification Checklist (Quick Reference)

### Critical Checks
- [ ] App loads without red error screen
- [ ] All 5 bottom tabs visible and working
- [ ] Centered white card displays correctly
- [ ] 4 action buttons at bottom of card
- [ ] Swipe LEFT/RIGHT works smoothly
- [ ] Haptic feedback on swipes and button taps

### iOS-Specific
- [ ] Safe area respected (no notch overlap)
- [ ] Native iOS share sheet appears
- [ ] Smooth 60fps animations
- [ ] No Unicode/emoji issues (all SVG icons)
- [ ] Typography renders clearly

### Interactions
- [ ] Know It button advances to next card
- [ ] Don't Know button advances to next card
- [ ] Save button toggles bookmark icon
- [ ] Share button opens iOS share sheet
- [ ] "Show More" expands content
- [ ] Content scrolls within card

---

## 🐛 Common iOS Issues

| Issue | Solution |
|-------|----------|
| **App shows old code** | Close Expo Go completely (swipe up in app switcher), restart Expo Go, scan QR again |
| **QR code won't scan** | Check iPhone and computer are on same WiFi network |
| **App crashes on load** | Check Metro terminal for JavaScript errors; try `npx expo start --clear` |
| **Icons are squares** | Check `lucide-react-native` is installed: `npm install` |
| **Share doesn't work** | Check Expo Go permissions in iPhone Settings |
| **No haptic feedback** | Enable: Settings > Sounds & Haptics > System Haptics |
| **Notch overlaps content** | Check `SafeAreaView` is wrapping content in App.tsx |
| **Swipes don't work** | Try harder/faster swipes; check Metro logs for gesture errors |

---

## 📊 Testing Workflow

### First-Time Setup
```powershell
# 1. Sync with latest code
.\sync-with-git.bat

# 2. Install dependencies (if needed)
npm install

# 3. Start iOS verification
.\quick-verify-ios.bat

# 4. On iPhone:
#    - Install Expo Go from App Store
#    - Open Expo Go
#    - Scan QR code
#    - Wait 60 seconds for first load
```

### Regular Testing (After Code Changes)
```powershell
# Quick test on iOS
.\quick-verify-ios.bat

# Or test all platforms
.\quick-verify-all.bat
```

### Before Pushing to Git
```powershell
# 1. Test all platforms
.\quick-verify-all.bat

# 2. Verify all checks pass
# 3. Sync with git
.\sync-with-git.bat
```

---

## 💡 Pro Tips

### Faster Testing
- **Keep Expo Go running** - Don't close between tests
- **Use "Reload"** - Shake device, tap "Reload" instead of scanning QR again
- **Metro stays running** - No need to restart Metro for small changes

### Debugging on iPhone
- **Shake device** - Opens Expo developer menu
- **Reload** - Refreshes app without rescanning QR
- **Debug Remote JS** - Opens Chrome debugger
- **Show Performance Monitor** - Shows FPS and memory

### Multiple Devices
You can test on multiple iPhones simultaneously:
1. Start Metro once: `.\quick-verify-ios.bat`
2. Scan QR code from multiple iPhones
3. All devices connect to same Metro server
4. Test consistency across different iPhone models

---

## 🎯 What to Check on iOS

### Visual (5 seconds)
Quick visual scan to ensure nothing is obviously broken:
- Bottom tabs appear (5 tabs)
- White card centered on screen
- 4 colored buttons at card bottom
- Icons render (not squares)

### Interactions (30 seconds)
Test all user interactions:
- Swipe left → next card
- Swipe right → previous card
- Tap Know It → advances
- Tap Don't Know → advances
- Tap Save → bookmark toggles
- Tap Share → iOS share sheet appears
- Tap "Show More" → content expands
- Scroll within card → content scrolls

### iOS Polish (30 seconds)
iOS-specific quality checks:
- Feel haptic feedback on swipe
- Feel haptic feedback on button tap
- Check safe area (no notch overlap)
- Check animations are smooth
- Check share sheet is native iOS UI
- Check typography is crisp and clear

**Total time: ~65 seconds per test**

---

## 📝 For Next AI Session

When an AI needs to test iOS changes:

```powershell
# 1. Read this guide first
cat iOS-VERIFICATION-GUIDE.md

# 2. Read the comprehensive checklist
cat VERIFICATION-CHECKLIST.md

# 3. Run quick verification
.\quick-verify-ios.bat

# 4. Instruct user:
"Please scan the QR code with Expo Go and verify the iOS-specific checks"
```

---

## 📚 Additional Resources

- **Comprehensive Checklist:** [VERIFICATION-CHECKLIST.md](VERIFICATION-CHECKLIST.md)
- **Current State:** [HANDOFF.md](HANDOFF.md)
- **Project Context:** [.claude/PROJECT_CONTEXT.md](.claude/PROJECT_CONTEXT.md)

---

**Happy Testing!** 🎉
