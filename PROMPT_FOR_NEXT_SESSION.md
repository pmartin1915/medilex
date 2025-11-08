# Prompt for Next Claude Code Session

## Context

I'm working on a Healthcare Vocabulary App built with Expo and React Native. The app was experiencing white/black screen issues on Android emulator. We added comprehensive debugging infrastructure (error logger, startup diagnostics, debug screen), but now the app has critical runtime errors preventing it from loading.

## Current State

### What Works
- Metro bundler starts successfully
- Android emulator connects properly
- Code compiles without syntax errors
- ADB connection is stable

### What's Broken

**Critical Runtime Error:**
```
[runtime not ready]: Invariant Violation: TurboModuleRegistry.getEnforcing(...):
'PlatformConstants' could not be found.
Verify that a module by this name is registered in the native binary.

Stack trace shows:
- invariant (hermes-stable:10623:25)
- getEnforcing (hermes-stable:10586:26)
- anonymous (hermes-stable:13837:49)
- loadModuleImplementation (hermes-stable:262:40)
- guardedLoadModule (hermes-stable:175:37)
- metroRequire (hermes-stable:82:91)
```

**Note:** The error shows `platform=ios` in the URL even when running on Android emulator.

**Symptoms:**
- **iOS:** Shows the above error in red screen
- **Android:** Shows strange blue/black/white smudged background, completely unresponsive, buttons don't work
- **Both platforms:** App never reaches the startup loader we created

## What We've Tried

1. ✅ Cleared all caches (Metro, Expo, npm, watchman)
2. ✅ Reinstalled node_modules multiple times
3. ✅ Fixed ADB connection issues
4. ✅ Made errorLogger safer (wrapped ErrorUtils in try-catch)
5. ✅ Disabled New Architecture in app.json
6. ✅ Created metro.config.js
7. ❌ Still getting TurboModuleRegistry errors

## Files Recently Modified

### Created Files (Debugging Infrastructure)
- `src/utils/errorLogger.ts` - Error logging system
- `src/components/StartupLoader.tsx` - Startup diagnostics
- `src/screens/DebugScreen.tsx` - Debug panel
- `metro.config.js` - Metro configuration
- Multiple .md documentation files

### Modified Files
- `App.tsx` - Added StartupLoader wrapper, debug tab
- `src/components/ErrorBoundary.tsx` - Enhanced error display
- `app.json` - Set `newArchEnabled: false`, removed edge-to-edge settings

## Key Technical Details

**Project Structure:**
- Expo SDK: ~54.0.0
- React Native: 0.76.5
- TypeScript with strict mode
- Using Expo Go (not development build)
- Bottom tab navigation with 5 screens
- Zustand for state management
- AsyncStorage for persistence

**app.json Configuration:**
```json
{
  "expo": {
    "name": "HealthcareVocabApp",
    "newArchEnabled": false,
    "android": {
      "package": "com.healthcarevocabapp"
    }
  }
}
```

**Dependencies:**
- @react-navigation/native & bottom-tabs
- @react-native-async-storage/async-storage
- expo-speech
- lucide-react-native
- zustand
- react-native-gesture-handler

## The Core Problem

The error `'PlatformConstants' could not be found` suggests:
1. Native modules aren't loading/linking correctly
2. There's a mismatch between JavaScript code expectations and native runtime
3. Possibly using APIs that require a development build instead of Expo Go
4. The platform detection is confused (showing iOS even on Android)

## What Needs to be Fixed

### Primary Goal
Fix the TurboModuleRegistry error so the app actually loads and shows the UI.

### Secondary Goals
1. Ensure the debugging infrastructure we built (StartupLoader, ErrorLogger, DebugScreen) works properly once the app loads
2. Verify app works on both Android emulator and iOS device/simulator
3. Make sure the solution is stable and won't regress

## Specific Questions to Investigate

1. **Is the debugging infrastructure we added incompatible with Expo Go?**
   - Does importing certain modules at the top level cause issues?
   - Should we lazy-load some of these debugging features?

2. **Is there a version mismatch?**
   - Expo 54 + React Native 0.76.5 - are these compatible?
   - Do we need to downgrade/upgrade something?

3. **Are we using APIs that require a development build?**
   - Check if any imports require native compilation
   - Verify all packages are Expo Go compatible

4. **Is the metro bundler serving the wrong bundle?**
   - Why does it show `platform=ios` on Android?
   - Is there a caching issue causing old bundles to load?

5. **Do we need to use a development build instead of Expo Go?**
   - Would `npx expo prebuild` and building native binaries solve this?
   - Or should we stick with Expo Go and remove incompatible code?

## Expected Behavior

When fixed, the app should:
1. Start Metro bundler successfully ✅ (already works)
2. Connect to Android emulator ✅ (already works)
3. Load JavaScript bundle without errors ❌ (BROKEN)
4. Show StartupLoader component with 4 initialization steps
5. Display Home screen with medical vocabulary terms
6. Respond to touch/navigation
7. Have working Debug tab to view logs

## Files to Review

Priority files to examine:
1. `App.tsx` - Entry point with StartupLoader
2. `src/utils/errorLogger.ts` - May be causing early native module access
3. `src/components/StartupLoader.tsx` - First component that should render
4. `package.json` - Verify all dependencies are Expo Go compatible
5. `metro.config.js` - Check bundler configuration
6. `app.json` - Verify Expo configuration is correct

## Suggested Debugging Approach

1. **Verify Expo Go compatibility:**
   - Check if all imported packages work with Expo Go
   - Look for packages that require custom native code

2. **Simplify App.tsx to minimal version:**
   - Comment out StartupLoader and debugging infrastructure
   - Try loading a basic "Hello World" component
   - If that works, gradually add features back to find the culprit

3. **Check import order:**
   - Native modules might be accessed too early
   - Try lazy loading imports
   - Move dynamic imports to after app initialization

4. **Verify platform targeting:**
   - Investigate why error shows `platform=ios` on Android
   - Check if Metro is bundling for the wrong platform
   - Clear all caches again with focus on platform-specific caches

5. **Consider development build:**
   - If issue persists, may need `npx expo prebuild`
   - Generate native iOS/Android folders
   - Build with `npx expo run:android` instead of Expo Go

## Success Criteria

The issue is resolved when:
- [ ] App loads on Android emulator without TurboModule errors
- [ ] App loads on iOS without TurboModule errors
- [ ] Startup loader appears and completes all 4 steps
- [ ] Home screen renders with medical terms
- [ ] Navigation between tabs works
- [ ] Debug tab is accessible and shows logs
- [ ] No "runtime not ready" errors
- [ ] No smudged/broken UI on Android

## Additional Context

- The app worked fine as a basic web app before adding mobile debugging features
- The user is working on Windows with Android emulator
- They also have an iPhone but copying errors from it is difficult
- The goal is to make debugging easier on Android emulator
- User is comfortable with batch files and PowerShell commands

## Commands Available

The project has these helper scripts:
- `start-android.bat` - Start Metro and connect to Android
- `clear-cache.bat` - Clear all caches
- `fix-android-connection.bat` - Reset ADB connection
- `fix-expo-go.bat` - Clear Expo-specific caches

## Request for Next Session

Please help me:
1. **Diagnose the root cause** of the TurboModuleRegistry error
2. **Fix the runtime errors** so the app actually loads
3. **Ensure the debugging infrastructure works** (or remove/modify if incompatible)
4. **Test on both Android and iOS** to ensure cross-platform functionality
5. **Provide clear instructions** on what was changed and why

If the debugging infrastructure we added is incompatible with Expo Go, I'm open to:
- Simplifying or removing problematic features
- Using a development build instead
- Alternative approaches to debugging

The priority is getting a working app that loads properly, even if we need to scale back some of the debugging features temporarily.

---

## Quick Start for Debugging

```powershell
cd D:\Medilex\HealthcareVocabApp

# Clear everything
.\clear-cache.bat
npm install

# Start with cleared cache
npx expo start --clear

# Press 'a' for Android or 'i' for iOS
# Observe the TurboModuleRegistry error
```

The error appears immediately on app load, before any of our code executes.
