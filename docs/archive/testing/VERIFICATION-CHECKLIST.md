# Healthcare Vocab App - Verification Checklist

**Purpose:** Quick visual verification for testing the app after changes
**Usage:** Run `test-web.bat` or `quick-verify.bat`, then check each item below

---

## 🚀 Quick Start

```powershell
# Option 1: Automated web test
.\test-web.bat

# Option 2: Quick verification (opens checklist + browser)
.\quick-verify.bat
```

---

## ✅ Verification Checklist

### 1. BOTTOM NAVIGATION (App-wide)

**Location:** Bottom of screen, always visible

- [ ] **5 tabs visible:** Home, Learn, Library, Progress, Debug
- [ ] **Tab icons render:** Each tab has its icon
- [ ] **Tab labels visible:** Each tab has text label
- [ ] **Active tab highlighted:** Selected tab shows accent color
- [ ] **Tabs are clickable:** Can switch between tabs

**Expected:** Cream background, dark icons, active tab in muted blue

---

### 2. LEARN SCREEN - CARD LAYOUT

**Location:** Navigate to "Learn" tab

- [ ] **Centered white card:** Card is horizontally centered on screen
- [ ] **No action buttons on right side:** Buttons should NOT be floating on the right
- [ ] **Card has shadow:** Subtle shadow around white card
- [ ] **Cream background:** Background around card is warm cream color

**Expected:** Clean, centered card on cream background

---

### 3. CARD CONTENT (Scrollable)

**Location:** Inside the white card, scroll to see all content

- [ ] **Large term:** Word in large serif font at top (e.g., "magnanimous")
- [ ] **Pronunciation:** IPA pronunciation with speaker icon
- [ ] **Meta info:** Syllables and part of speech (e.g., "mag·nan·i·mous • adj.")
- [ ] **"DEFINITION" label:** Uppercase section label
- [ ] **Definition text:** Full definition displayed
- [ ] **"CLINICAL EXAMPLE" label:** Uppercase section label in accent color
- [ ] **Example sentence:** Clinical example in italics
- [ ] **"Show More" button:** Expandable button for additional details
- [ ] **Content scrolls:** Can scroll through long definitions

**Expected:** All content visible, properly formatted, scrollable

---

### 4. ACTION BUTTONS (Bottom of Card)

**Location:** Fixed at bottom of white card, inside the card border

- [ ] **4 buttons visible:** All four buttons appear in a horizontal row
- [ ] **Border separator:** Thin border line above buttons
- [ ] **Button positions:** Buttons are INSIDE the white card, not outside

**Individual Buttons:**

#### Know It (Green)
- [ ] **Color:** Green background (#8FAC8E)
- [ ] **Icon:** Thumbs up icon (SVG, not Unicode emoji)
- [ ] **Label:** "Know It" text visible
- [ ] **Clickable:** Button responds to clicks

#### Don't Know (Red)
- [ ] **Color:** Red background (#D17B6F)
- [ ] **Icon:** X icon (SVG, not Unicode emoji)
- [ ] **Label:** "Don't Know" text visible
- [ ] **Clickable:** Button responds to clicks

#### Save (Amber)
- [ ] **Color:** Amber background (#E8B66B)
- [ ] **Icon:** Bookmark icon (SVG, not Unicode emoji)
- [ ] **Label:** "Save" text visible
- [ ] **Clickable:** Button responds to clicks
- [ ] **State toggles:** Icon fills when bookmarked

#### Share (Teal)
- [ ] **Color:** Teal background (#7BAAA5)
- [ ] **Icon:** Share arrow icon (SVG, not Unicode emoji)
- [ ] **Label:** "Share" text visible
- [ ] **Clickable:** Button responds to clicks

**Expected:** 4 compact buttons in a row at bottom of card, each with icon + label

---

### 5. INTERACTIONS

**Swipe Gestures:**
- [ ] **Swipe LEFT:** Card slides left, shows next term
- [ ] **Swipe RIGHT:** Card slides right, shows previous term
- [ ] **Smooth animation:** Card slides smoothly (250ms duration)
- [ ] **Footer updates:** "Swipe ← Next • Swipe → Previous" visible at bottom

**Button Actions:**
- [ ] **Know It:** Card advances to next term
- [ ] **Don't Know:** Card advances to next term
- [ ] **Save:** Bookmark icon toggles (outline ↔ filled)
- [ ] **Share:** Opens native share dialog (or fallback on web)

**Expandable Content:**
- [ ] **"Show More" expands:** Shows etymology, categories, related terms
- [ ] **"Show Less" collapses:** Hides expanded content
- [ ] **Smooth transition:** Content appears/disappears smoothly

**Expected:** All interactions work smoothly, no errors in console

---

### 6. RESPONSIVENESS

- [ ] **Mobile view (< 768px):** Card adjusts to screen width
- [ ] **Tablet view (768-1024px):** Card stays centered, doesn't stretch too wide
- [ ] **Desktop view (> 1024px):** Card has max-width, stays centered
- [ ] **Buttons stack on very small screens:** Buttons may stack vertically if needed

---

### 7. VISUAL POLISH

- [ ] **Typography:** Serif font for term, clear hierarchy
- [ ] **Colors:** Warm cream background, white card, muted blue accents
- [ ] **Spacing:** Adequate white space, not cramped
- [ ] **Shadows:** Subtle card shadow, button shadows
- [ ] **Border radius:** Rounded corners on card and buttons
- [ ] **Icons:** All icons render clearly (SVG, not broken Unicode)

---

## 🐛 Common Issues & Solutions

### Issue: Bottom tabs not visible
**Solution:** Check App.tsx - ensure Tab.Navigator is rendering. Try `npx expo start --clear`

### Issue: Action buttons on right side (not at bottom)
**Solution:** Old code cached. Clear Metro cache: `npx expo start --clear`

### Issue: Icons show as squares/boxes
**Solution:** Not a Unicode issue - check if lucide-react-native is installed: `npm install`

### Issue: Buttons don't respond
**Solution:** Check browser console for errors. Verify handlers passed to MedicalTermCard

### Issue: Card not centered
**Solution:** Check SwipeableCard.tsx - should have `alignSelf: 'center'`

### Issue: Content not scrollable
**Solution:** Check MedicalTermCard.tsx - ensure ScrollView wraps content

---

## 📊 Platform-Specific Notes

### Web (Chrome/Firefox/Safari)
- Icons render as SVG (no Unicode issues)
- Share may show fallback UI (browser doesn't support native share)
- Swipe works with mouse drag
- Touch gestures work on touch screens
- **Testing Script:** `.\quick-verify.bat` or `.\test-web.bat`

### iOS (Expo Go / Simulator)

**Quick Start Testing:**
```powershell
# Recommended: Quick verification with checklist
.\quick-verify-ios.bat

# Or: Automated testing
.\test-ios.bat
```

**Setup Requirements:**
- **Physical iPhone:** Install "Expo Go" from App Store
- **iOS Simulator:** Requires macOS with Xcode installed (not available on Windows)

**Expected Behavior:**
- All features work identically to web
- Haptic feedback works (phone vibrates on swipes and button taps)
- Native iOS share dialog appears (share sheet)
- Smooth 60fps animations
- Safe area automatically handled (no notch/home indicator overlap)

**iOS-Specific Checks:**
- [ ] **App loads without errors** - No red error screen in Expo Go
- [ ] **Safe area respected** - Content doesn't overlap with notch or home indicator
- [ ] **Status bar visible** - Shows time/battery/signal at top
- [ ] **Haptic feedback on swipes** - Light vibration when swiping cards
- [ ] **Haptic feedback on buttons** - Light vibration when tapping action buttons
- [ ] **Native share sheet** - iOS share dialog with app icons appears
- [ ] **Smooth animations** - No lag, stutter, or frame drops
- [ ] **Typography renders clearly** - Serif fonts display properly
- [ ] **No Unicode issues** - All icons render as SVG (not broken squares)
- [ ] **Gestures feel natural** - Swipe threshold and animation timing feel right
- [ ] **Button touch targets** - All buttons easy to tap (≥44pt touch target)
- [ ] **No memory warnings** - App doesn't crash or show memory errors

**Common iOS Issues:**

| Issue | Solution |
|-------|----------|
| App shows old code after changes | Close Expo Go completely (swipe up in app switcher), restart Expo Go, scan QR again |
| QR code won't scan | Check iPhone and computer are on same WiFi network |
| App loads then crashes | Check Metro terminal for JavaScript errors; try `npx expo start --clear` |
| Icons show as squares | This shouldn't happen (SVG icons), but if so: check `lucide-react-native` installed |
| Share button doesn't work | Share sheet should appear on iOS - check Expo Go permissions |
| No haptic feedback | Check iPhone Settings > Sounds & Haptics > System Haptics is ON |
| Notch overlaps content | Check `SafeAreaView` wrapping in App.tsx |
| Swipes don't work | Try harder/faster swipes; check Metro logs for gesture handler errors |

**iOS Simulator Notes (Mac only):**
- Haptic feedback won't work (no physical device)
- Share sheet will appear but won't actually share
- Performance may be slower than real device
- To launch: Press `i` in Metro terminal or run simulator manually

**Expo Go App Tips:**
- First load takes 60+ seconds (downloading JS bundle)
- Subsequent loads are faster (cached)
- Shake device to open Expo developer menu
- In dev menu: "Reload" to refresh, "Debug Remote JS" to debug

### Android (Expo Go/Emulator)
- All features should work identically
- Haptic feedback works (vibrations)
- Native share dialog appears
- **Testing Scripts:** Various Android scripts available (see `start-android.bat`, etc.)

---

## ✅ Final Verification

**All green? Great!** The app is working as expected.

**Any red? Check:**
1. Metro bundler logs (`web-test-output.txt`)
2. Browser console errors
3. Clear cache and restart: `npx expo start --clear`
4. Re-read HANDOFF.md for latest changes

---

## 🤖 For Next AI Session

When starting a new session:

1. **Read HANDOFF.md first** - Understand current state
2. **Run `quick-verify.bat`** - Verify everything works before making changes
3. **Use this checklist** - Verify changes after coding
4. **Update HANDOFF.md** - Document any new changes

---

**Last Updated:** 2025-11-09 (iOS verification expansion)
**Current Branch:** claude/healthcare-vocabulary-app-011CUxCkrQVpukro5FXMKfVQ
