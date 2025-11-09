# Healthcare Vocabulary App - Project Context

## 📱 Project Overview

A React Native mobile app (iOS, Android, Web) for learning medical terminology through flashcards with spaced repetition and swipe-based interactions.

**Tech Stack:**
- React Native 0.76.5
- Expo SDK ~54.0.0
- TypeScript
- Zustand (state management)
- React Navigation (bottom tabs + stack)
- Expo Speech (pronunciation)

**Repository:** pmartin1915/medilex

---

## 👤 User Information

**Name:** Perry
**Environment:** Windows (PowerShell)
**Development Setup:**
- Android SDK: `D:\Android\Sdk`
- Project Path: `D:\Medilex\HealthcareVocabApp`
- AVD: `Medium_Phone_API_36.1`
- Tests on: iOS (Expo Go), Android Emulator, Web

**Working Style:**
- Appreciates systematic, step-by-step approaches
- Prefers clear explanations with command examples
- Likes helper scripts (.bat files) for common tasks
- Values being able to modify code without breaking things
- Wants to take time to understand changes

---

## 🏗️ Codebase Architecture

### Key Directories
```
src/
├── components/
│   ├── SwipeableCard.tsx         # Handles swipe gestures (horizontal + vertical)
│   ├── MedicalTermCard.tsx       # Card UI display
│   └── ProgressIndicator.tsx     # Shows current position in deck
├── screens/
│   ├── LearnScreen.tsx           # Main learning interface with swipe cards
│   ├── ReviewScreen.tsx          # Review bookmarked/favorited terms
│   ├── ProgressScreen.tsx        # Stats and streaks
│   └── HomeScreen.tsx            # Welcome/onboarding
├── store/
│   ├── wordStore.ts              # Zustand store for terms & progress
│   └── streakStore.ts            # Zustand store for study streaks
├── data/
│   └── medicalTerms.ts           # JSON data of medical terms
├── theme/
│   └── theme.ts                  # Colors, fonts, spacing
└── types/
    └── index.ts                  # TypeScript interfaces

App.tsx                            # Root navigation setup
index.ts                           # Entry point
```

### State Management (Zustand)

**wordStore.ts:**
- `terms[]` - All medical terms
- `updateProgress()` - Track if user knows term
- `toggleFavorite()` - Mark favorites
- `toggleBookmark()` - Mark for review
- `getProgress()` - Get term-specific progress

**streakStore.ts:**
- `currentStreak` - Days studied consecutively
- `totalStudySessions` - All-time session count
- `recordStudySession()` - Update stats

### Swipe Gesture System

**SwipeableCard.tsx:**
- Detects horizontal vs vertical swipes
- Horizontal: Evaluates knowledge (Know/Don't Know)
- Vertical: Navigation only (Next/Previous)
- Uses React Native `PanResponder` + `Animated`

**Current Thresholds:**
- Horizontal: 25% of screen width
- Vertical: 50px

**Props:**
```typescript
interface Props {
  children: React.ReactNode;
  onSwipeLeft: () => void;    // Don't Know (evaluates)
  onSwipeRight: () => void;   // Know It (evaluates)
  onSwipeUp?: () => void;     // Next card (no eval)
  onSwipeDown?: () => void;   // Previous card
}
```

---

## 🔧 Common Issues & Solutions

### 1. Metro Bundler Cache Issues
**Symptom:** iOS/Android/Web showing old code after pull
**Solution:**
```powershell
npx expo start --clear
# On iOS: Close Expo Go completely, reopen, rescan QR
```

### 2. Android Emulator Won't Launch App
**Symptom:** Emulator opens but app doesn't load
**Root Causes:**
- ADB connection issues
- Package manager service not responding
- Cache corruption

**Solutions:**
```powershell
# Quick fix:
.\troubleshoot.bat  # Select option 5 (full reset)

# Manual fix:
adb kill-server
adb start-server
emulator -avd Medium_Phone_API_36.1 -no-snapshot-load
# Wait for boot, then:
npx expo start --clear
```

### 3. Merge Conflicts During Git Pull
**Symptom:** Git pull creates conflict markers in files
**Solution:**
```powershell
# Accept incoming changes:
git checkout --theirs <file>
git add .
git commit -m "Merge: Accept incoming changes"
```

### 4. "Can't find service: package" Error
**Symptom:** Android error when pressing 'a' in Metro
**Solution:**
```powershell
adb kill-server && adb start-server
# Or run: .\fix-adb-quick.bat
```

---

## 📋 Helper Scripts (Available .bat files)

| Script | Purpose |
|--------|---------|
| `start-android.bat` | Verifies ADB, emulator readiness, starts Metro |
| `troubleshoot.bat` | Interactive menu for common Android issues |
| `clear-cache.bat` | Clears all caches (npm, expo, metro) |
| `GET_LATEST_CODE.bat` | Pulls latest from branch and verifies |
| `QUICK_FIX_ALL_PLATFORMS.bat` | Clears caches, verifies code, starts Metro |
| `RESOLVE_CONFLICTS.bat` | Accepts incoming changes during merge conflicts |

**Note:** All Android scripts now include PATH setup:
```batch
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator
```

---

## 🐛 Known Issues & Areas for Improvement

### HIGH PRIORITY

1. **Previous Swipe Broken**
   - `onSwipeDown` should go to previous card
   - Currently implemented but may have edge cases
   - Location: `LearnScreen.tsx:51-56`, `SwipeableCard.tsx:77-85`

2. **Missing Error Handling**
   - Speech synthesis failures
   - Storage persistence errors
   - Network issues (if added later)

3. **Missing Loading States**
   - Initial app load
   - Data persistence operations
   - Screen transitions

4. **No Input Validation**
   - Edge cases: empty term list
   - Invalid progress data
   - Corrupted AsyncStorage data

### MEDIUM PRIORITY

5. **Swipe Gesture Enhancements Needed**
   - Visual feedback during swipe (color indicators?)
   - Haptic feedback on actions
   - Animation polish (ease curves, spring physics)
   - Threshold tuning (currently hardcoded)
   - Multi-touch gesture conflicts

6. **UX Improvements**
   - Undo last swipe action
   - Confirm before resetting progress
   - Empty states for bookmarks/favorites
   - Tutorial/onboarding for gestures

7. **Performance**
   - Large term lists may cause lag
   - Consider virtualization for ReviewScreen
   - Optimize re-renders in SwipeableCard

8. **Accessibility**
   - Screen reader support
   - Keyboard navigation (web)
   - High contrast mode
   - Font scaling support

### LOW PRIORITY

9. **Testing**
   - No unit tests currently
   - No E2E tests
   - Manual testing only

10. **Code Quality**
    - Some hardcoded values (colors, thresholds)
    - Magic numbers throughout
    - Inconsistent error handling patterns

---

## 🎯 Future Goals (In Order)

1. **Fix Previous Swipe** - Ensure `onSwipeDown` works reliably
2. **Enhance Swipe Gestures** - Better feedback, animations, tuning
3. **Add Error Handling** - Graceful failures, user feedback
4. **Add Loading States** - Skeleton screens, spinners
5. **Quality Improvements** - Accessibility, performance, polish
6. **Testing Suite** - Unit + E2E tests
7. **App Store Deployment** - Production builds, screenshots, listings

---

## 🔨 Development Workflow

### Starting Fresh Session
```powershell
cd D:\Medilex\HealthcareVocabApp
git pull origin <current-branch>
npx expo start --clear
```

### Testing Changes
- **iOS:** Press `i` in Metro (or scan QR in Expo Go)
- **Android:** Press `a` in Metro
- **Web:** Press `w` in Metro (or `npm run web`)

### Common Commands
```powershell
# Clear all caches
npx expo start --clear

# Restart Metro
# Ctrl+C, then: npx expo start

# Check git status
git status
git log --oneline -5

# Fix Android ADB
adb kill-server && adb start-server

# Launch emulator manually
emulator -avd Medium_Phone_API_36.1 -no-snapshot-load
```

---

## 🎨 Design Philosophy

**User Wants:**
- Code that's easy to modify without breaking
- Clear separation of concerns
- Descriptive variable/function names
- Comments for complex logic
- Modular, reusable components

**Code Principles:**
- Keep components focused (single responsibility)
- Extract magic numbers to constants
- Add TypeScript types for safety
- Handle edge cases gracefully
- Provide user feedback for actions

---

## 📦 Key Dependencies to Know

| Package | Purpose | Version |
|---------|---------|---------|
| `expo` | Development platform | ~54.0.0 |
| `react-native` | Core framework | 0.76.5 |
| `zustand` | State management | ^4.5.2 |
| `@react-navigation/*` | Navigation | ^6.x |
| `expo-speech` | Text-to-speech | ~12.0.2 |
| `@react-native-async-storage/async-storage` | Persistence | ^1.23.1 |

---

## 🚨 Important Notes

### When Making Changes:

1. **Always test on all three platforms** (iOS, Android, Web)
2. **Clear caches after code changes** - Metro is aggressive
3. **Watch for merge conflicts** - User may have local changes
4. **Provide .bat scripts** for complex multi-step operations
5. **Explain the "why"** not just the "what"
6. **Use TypeScript strictly** - helps catch errors early

### When Adding Features:

1. Update this context document
2. Update PLATFORM_FIXES.md if troubleshooting needed
3. Create helper scripts if user will repeat the action
4. Test edge cases (empty states, errors, large datasets)
5. Consider all three platforms (web may have different behaviors)

### Git Workflow:

- Main development branch: `claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB`
- Always commit with clear messages
- Push after significant changes
- User may need to pull and resolve conflicts

---

## 🔍 Quick Reference: Where to Find Things

**Need to modify swipe gestures?**
- Logic: `src/components/SwipeableCard.tsx`
- Usage: `src/screens/LearnScreen.tsx`
- Thresholds: Lines 5-6 in `SwipeableCard.tsx`

**Need to add a new medical term?**
- Data: `src/data/medicalTerms.ts`
- Type: `src/types/index.ts` (MedicalTerm interface)

**Need to change colors/styling?**
- Theme: `src/theme/theme.ts`
- Component styles: Bottom of each component file

**Need to modify state/persistence?**
- Word state: `src/store/wordStore.ts`
- Streak state: `src/store/streakStore.ts`
- AsyncStorage keys: Look for `@healthcare_vocab_` prefix

**Need to debug platform-specific issues?**
- iOS issues: Usually Metro cache - `npx expo start --clear`
- Android issues: Usually ADB - `.\troubleshoot.bat`
- Web issues: Check browser console, may need cache clear

**Need to add a new screen?**
- Create in `src/screens/`
- Add to navigation in `App.tsx`
- Add tab icon/name if needed

---

## 💡 Tips for Future Sessions

1. **User appreciates when you:**
   - Take time to explain complex changes
   - Provide step-by-step instructions
   - Create helper scripts for workflows
   - Test before claiming something works
   - Acknowledge when something breaks

2. **User gets frustrated when:**
   - Changes don't work across all platforms
   - Cache issues aren't resolved
   - Merge conflicts are confusing
   - Steps are skipped in explanations

3. **Best practices with this user:**
   - Use PowerShell syntax (not bash)
   - Provide .bat files for multi-step operations
   - Test changes before pushing
   - Clear caches liberally
   - Explain trade-offs when making decisions

---

## 📝 Recent Changes (Keep Updated)

### 2025-11-09: Vertical Swipe Navigation
- Added vertical swipe support to `SwipeableCard.tsx`
- Swipe UP = next card (no evaluation)
- Swipe DOWN = previous card
- Updated `LearnScreen.tsx` with handlers
- Added footer indicators for vertical swipes

### Known State:
- ✅ Vertical swipe: Working
- ⚠️ Previous swipe: Needs testing/fixing
- ⚠️ Error handling: Missing
- ⚠️ Loading states: Missing

---

## 🎓 Learning About the Codebase

If you're a new Claude instance, here's how to get oriented:

1. **Read this document first** (you are here!)
2. **Check `package.json`** - understand dependencies
3. **Read `App.tsx`** - navigation structure
4. **Read store files** - data flow
5. **Read `LearnScreen.tsx`** - main user interaction
6. **Read `SwipeableCard.tsx`** - gesture handling
7. **Check `PLATFORM_FIXES.md`** - troubleshooting guide

**Quick Questions to Answer:**
- Where are medical terms stored? → `src/data/medicalTerms.ts`
- How is progress tracked? → `wordStore.ts` with AsyncStorage
- How do swipes work? → `SwipeableCard.tsx` PanResponder
- What navigation library? → React Navigation (bottom tabs)
- What's the main interaction? → Swipe cards on LearnScreen

---

## 🚀 Next Session Priorities

Based on user's request, focus on:

1. **Test and fix "previous swipe"** functionality
2. **Enhance swipe gesture system:**
   - Visual feedback
   - Better animations
   - Configurable thresholds
   - Haptic feedback
3. **Add error handling:**
   - Try/catch blocks
   - User-facing error messages
   - Fallback states
4. **Add loading states:**
   - Initial load
   - Data persistence
   - Screen transitions
5. **Quality improvements:**
   - Edge case handling
   - Performance optimization
   - Code cleanup (magic numbers → constants)

**Remember:** User wants "easily modifiable without breaking it" - prioritize:
- Clear code structure
- Good TypeScript types
- Descriptive names
- Helpful comments
- Modular design

---

*Last Updated: 2025-11-09*
*Update this file when significant changes are made!*
