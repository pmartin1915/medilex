# Next Session Debugging Checklist

**Read this first, then read PROMPT_FOR_NEXT_SESSION.md for full context**

---

## 🎯 Primary Mission

Fix the TurboModuleRegistry error preventing the app from loading.

---

## 📋 Step-by-Step Investigation

### Phase 1: Understand the Error (15 minutes)

- [ ] Read `PROMPT_FOR_NEXT_SESSION.md` completely
- [ ] Read `CURRENT_STATUS.md` for quick overview
- [ ] Review the exact error message in that prompt
- [ ] Understand: This is a native module initialization error
- [ ] Note: Error happens BEFORE any of our code runs

### Phase 2: Check Expo Compatibility (10 minutes)

- [ ] Read `package.json` - check ALL dependencies
- [ ] Verify each package is Expo Go compatible
- [ ] Check for packages requiring custom native code
- [ ] Look for packages that need `expo-modules-core`
- [ ] Specifically check:
  - [ ] `lucide-react-native` - does it need native modules?
  - [ ] `@react-native-async-storage/async-storage` - should be fine
  - [ ] `expo-speech` - should be fine
  - [ ] `react-native-gesture-handler` - should be fine
  - [ ] Any others that seem suspicious

### Phase 3: Simplify App Entry Point (20 minutes)

- [ ] Read current `App.tsx`
- [ ] Create a backup: `App.tsx.backup`
- [ ] Create minimal test version:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World - Minimal Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F1',
  },
  text: {
    fontSize: 24,
    color: '#2B2B2B',
  },
});
```

- [ ] Test: Does this minimal version load?
  - [ ] If YES: Problem is in our added code
  - [ ] If NO: Problem is deeper (Expo/RN version issue)

### Phase 4: If Minimal Works - Gradually Add Back (30 minutes)

- [ ] Add GestureHandlerRootView
  - [ ] Test - works?
- [ ] Add Navigation
  - [ ] Test - works?
- [ ] Add one simple screen
  - [ ] Test - works?
- [ ] Add ErrorBoundary
  - [ ] Test - works?
- [ ] Add errorLogger import
  - [ ] Test - works? (This might break it!)
- [ ] Add StartupLoader
  - [ ] Test - works?

**Note where it breaks!**

### Phase 5: Fix the Breaking Component (30 minutes)

Based on where it broke:

#### If errorLogger breaks it:
- [ ] Check if it accesses native modules at import time
- [ ] Make all native access lazy
- [ ] Don't access ErrorUtils until after app initialized
- [ ] Consider removing errorLogger entirely if needed

#### If StartupLoader breaks it:
- [ ] Check what it imports
- [ ] Make imports lazy/dynamic
- [ ] Defer initialization checks

#### If Navigation breaks it:
- [ ] Check @react-navigation versions
- [ ] Verify compatibility with RN 0.76.5
- [ ] May need to downgrade

### Phase 6: Alternative - Downgrade Approach (If Phase 4 fails)

If minimal app ALSO fails:

- [ ] Check Expo SDK 54 + RN 0.76.5 compatibility
- [ ] Look for known issues with this version combo
- [ ] Consider downgrading to Expo 52 or 53
- [ ] Update `package.json` with compatible versions

### Phase 7: Alternative - Development Build (If all else fails)

- [ ] Run `npx expo prebuild`
- [ ] Generate native iOS and Android folders
- [ ] Update `.gitignore` to NOT ignore them
- [ ] Build with `npx expo run:android`
- [ ] Test if development build works where Expo Go failed

---

## 🔍 Specific Things to Check

### Check 1: Import Order in App.tsx
```typescript
// DANGEROUS - imports at top level might access natives
import { errorLogger } from './src/utils/errorLogger';

// SAFER - lazy import after app ready
const initErrorLogger = async () => {
  const { errorLogger } = await import('./src/utils/errorLogger');
  await errorLogger.initialize();
};
```

### Check 2: ErrorUtils Access
In `src/utils/errorLogger.ts` (line ~112-133):
- Currently wrapped in try-catch
- But might still execute at import time
- Consider moving ALL of this into `initialize()` method

### Check 3: Platform Constants
The error mentions `PlatformConstants` specifically:
- This is used by React Native core for Platform.OS detection
- If this isn't loading, something is fundamentally broken
- May indicate Metro is serving wrong bundle
- Or native binary isn't compatible

### Check 4: Metro Bundle Platform
In error message: `platform=ios` even on Android
- This is suspicious!
- Metro might be bundling for wrong platform
- Check Metro output: "Bundling for ios" vs "Bundling for android"
- May need to explicitly target platform

---

## 🛠️ Commands Reference

```powershell
# Start fresh every time
.\clear-cache.bat
npm install
npx expo start --clear

# Test on Android
# Press 'a'

# Test on iOS
# Press 'i'

# View logs
npx react-native log-android
# or
npx react-native log-ios
```

---

## ✅ Success Criteria

You've succeeded when:

1. [ ] App loads on Android without TurboModule error
2. [ ] App loads on iOS without TurboModule error
3. [ ] Can see actual UI (not smudged screen)
4. [ ] App is responsive to touch
5. [ ] Navigation works between screens

**Bonus (if possible without breaking):**
6. [ ] StartupLoader shows and completes
7. [ ] Debug tab is accessible
8. [ ] Error logging works

**If bonus not possible:**
- Document what had to be removed/simplified
- Explain why it was incompatible
- Suggest alternative approaches

---

## 📝 Documentation Requirements

When you fix it, please:

1. **Update CURRENT_STATUS.md** with:
   - What was wrong
   - What you changed
   - Current status (should be 🟢)

2. **Create FIX_SUMMARY.md** explaining:
   - Root cause of the error
   - Why it happened
   - What was changed
   - How to prevent it in future

3. **Update relevant code comments**:
   - Explain any workarounds
   - Note any limitations
   - Mark any temporary fixes

4. **Test both platforms** and document results

---

## 🚨 Red Flags to Watch For

- Any import that accesses native code at module scope
- Use of `Platform.OS` before app initializes
- Direct access to `NativeModules` at import time
- Synchronous native calls during import
- Version mismatches between Expo SDK and RN version

---

## 💡 Quick Wins to Try First

1. **Remove all debugging infrastructure temporarily**
   - Comment out errorLogger
   - Comment out StartupLoader
   - Comment out DebugScreen
   - Use original simple App.tsx
   - Test if THIS works

2. **If #1 works:**
   - Add back ONE feature at a time
   - Test after each addition
   - Find the exact culprit

3. **If #1 fails:**
   - Try minimal "Hello World" App
   - If that fails, it's an Expo/RN version issue

---

## 📞 When to Consider Each Approach

**Use Simplification** if:
- Minimal app works fine
- Problem is in our added code
- Can isolate breaking component

**Use Downgrade** if:
- Even minimal app fails
- Expo 54 + RN 0.76.5 incompatibility
- Known issues with this version combo

**Use Development Build** if:
- Need features incompatible with Expo Go
- User OK with longer build times
- Can install native dev tools (Android Studio, Xcode)

---

## ⏱️ Time Expectations

- **Best case:** 30 min (simple code fix)
- **Medium case:** 1-2 hours (requires simplification/refactoring)
- **Worst case:** 2-3 hours (requires version downgrade or dev build)

---

## 🎯 Priority Order

1. **Get app loading** (even if basic) - CRITICAL
2. **Get navigation working** - HIGH
3. **Get startup diagnostics working** - MEDIUM
4. **Get error logging working** - MEDIUM
5. **Get debug screen working** - LOW

If you can only achieve #1 and #2, that's acceptable!
The user just needs a functional app they can debug.

---

**Good luck! You've got this! 🚀**

Read the PROMPT_FOR_NEXT_SESSION.md now for full context.
