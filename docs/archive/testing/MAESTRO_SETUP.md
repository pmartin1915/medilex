# Maestro E2E Testing - Quick Start Guide

## What is Maestro?

Maestro is the fastest-growing mobile UI testing framework in 2025. It's easier than Detox, more reliable than Appium, and specifically designed for React Native apps like yours.

### Why Maestro?
- ✅ Simple YAML-based test syntax
- ✅ Auto-handles async operations (no more `waitFor` hell)
- ✅ Built-in visual test recorder (Maestro Studio)
- ✅ Works on iOS and Android
- ✅ CI/CD friendly
- ✅ Fast execution

---

## Installation

### Prerequisites
- Node.js installed ✅
- iOS Simulator or Android Emulator
- Homebrew (macOS) or curl (Linux/Windows)

### Install Maestro CLI

**macOS/Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Windows:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Verify Installation
```bash
maestro --version
# Should output: maestro 1.x.x
```

---

## Project Setup

### 1. Create Test Directory
```bash
cd HealthcareVocabApp
mkdir __maestro__
cd __maestro__
```

### 2. Configure App ID

Create `config.yaml`:
```yaml
appId: com.healthcarevocabapp
```

---

## Writing Your First Test

### Example 1: Basic Navigation Test

Create `__maestro__/navigation.yaml`:

```yaml
appId: com.healthcarevocabapp
---
# Test: Navigate through all tabs
- launchApp
- assertVisible: "Home"

# Test Home tab
- tapOn: "Home"
- assertVisible: "Good morning"
- assertVisible: "Word of the Day"

# Test Learn tab
- tapOn: "Learn"
- assertVisible: "Medical Term"
- assertVisible: "1 / 75"

# Test Library tab
- tapOn: "Library"
- assertVisible: "Search medical terms"
- assertVisible: "Categories"

# Test Progress tab
- tapOn: "Progress"
- assertVisible: "Your Progress"
- assertVisible: "Terms Studied"

# Test Debug tab
- tapOn: "Debug"
- assertVisible: "Debug Console"
```

### Example 2: Study Session Flow

Create `__maestro__/study-session.yaml`:

```yaml
appId: com.healthcarevocabapp
---
# Test: Complete a study session
- launchApp
- tapOn: "Learn"
- assertVisible: "1 / 75"

# Swipe through 5 cards
- swipe:
    direction: RIGHT
- assertVisible: "2 / 75"

- swipe:
    direction: RIGHT
- assertVisible: "3 / 75"

- swipe:
    direction: RIGHT
- assertVisible: "4 / 75"

- swipe:
    direction: RIGHT
- assertVisible: "5 / 75"

# Test Know It button
- tapOn: "Know It"
- assertVisible: "6 / 75"

# Test Don't Know button
- tapOn: "Don't Know"
- assertVisible: "7 / 75"
```

### Example 3: Library Search

Create `__maestro__/library-search.yaml`:

```yaml
appId: com.healthcarevocabapp
---
# Test: Search functionality
- launchApp
- tapOn: "Library"
- assertVisible: "Search medical terms"

# Type in search box
- tapOn: "Search medical terms"
- inputText: "tachy"

# Verify search results
- assertVisible: "Tachycardia"

# Clear search
- tapOn: "Clear"
- assertVisible: "Categories"

# Try another search
- tapOn: "Search medical terms"
- inputText: "heart"
- assertVisible: "result"
```

### Example 4: Favorites Management

Create `__maestro__/favorites.yaml`:

```yaml
appId: com.healthcarevocabapp
---
# Test: Add and view favorites
- launchApp
- tapOn: "Home"

# Favorite the word of the day
- tapOn:
    id: "favorite-button"
- assertVisible: "favorite-icon-filled"

# Go to Library and filter favorites
- tapOn: "Library"
- tapOn: "Favorites"
- assertVisible: "Tachycardia"
```

---

## Running Tests

### Run Single Test
```bash
maestro test __maestro__/navigation.yaml
```

### Run All Tests
```bash
maestro test __maestro__/
```

### Run with Video Recording
```bash
maestro test --record __maestro__/study-session.yaml
```

### Run on Specific Device
```bash
maestro test --device "iPhone 15 Pro" __maestro__/navigation.yaml
```

---

## Maestro Studio (Visual Test Recorder)

### Launch Studio
```bash
maestro studio
```

This opens:
1. Device simulator
2. Interactive UI hierarchy
3. Record button for creating tests
4. Live test runner

### Recording a Test
1. Launch Maestro Studio
2. Click "Record"
3. Interact with your app
4. Studio generates YAML automatically
5. Save to `__maestro__/my-test.yaml`

---

## Advanced Features

### Conditional Logic
```yaml
- tapOn: "Login"
- assertVisible:
    text: "Welcome"
    optional: true
- runFlow:
    when:
      visible: "Login"
    commands:
      - inputText: "user@example.com"
      - tapOn: "Submit"
```

### Loops
```yaml
- repeat:
    times: 5
    commands:
      - swipe:
          direction: RIGHT
      - assertVisible: "Card ${index}"
```

### Environment Variables
```yaml
- launchApp:
    arguments:
      ENV: "test"
- inputText: "${TEST_EMAIL}"
```

### Screenshots
```yaml
- tapOn: "Home"
- takeScreenshot: "home-screen"
```

---

## Integration with CI/CD

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npx expo export

      - name: Run Maestro tests
        run: |
          export PATH="$PATH:$HOME/.maestro/bin"
          maestro test __maestro__/

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: maestro-results
          path: ~/.maestro/tests/
```

---

## Best Practices

### DO ✅
- Write descriptive test names
- Test critical user paths first
- Use assertions liberally
- Keep tests independent
- Record tests for documentation
- Test on both platforms (iOS & Android)

### DON'T ❌
- Hard-code timing (use Maestro's auto-wait)
- Make tests dependent on each other
- Test implementation details
- Ignore flaky tests
- Skip error cases

---

## Common Patterns for Your App

### Pattern 1: Study Flow Test
```yaml
- launchApp
- tapOn: "Start Study Session"
- repeat:
    times: 10
    commands:
      - assertVisible: "Medical Term"
      - swipe: { direction: RIGHT }
- assertVisible: "Session Complete"
```

### Pattern 2: Progress Verification
```yaml
- launchApp
- tapOn: "Progress"
- assertVisible: "Terms Studied: ${EXPECTED_COUNT}"
- assertVisible: "Current Streak: ${EXPECTED_STREAK}"
```

### Pattern 3: Data Persistence
```yaml
- launchApp
- tapOn: "Learn"
- tapOn: "Know It"
- launchApp  # Restart app
- tapOn: "Progress"
- assertVisible: "Terms Studied: 1"  # Verify saved
```

---

## Debugging Tests

### View Logs
```bash
maestro test --verbose __maestro__/navigation.yaml
```

### Interactive Mode
```bash
maestro test --interactive __maestro__/navigation.yaml
```

### Screenshot on Failure
```yaml
- onError:
    - takeScreenshot: "error-${timestamp}"
```

---

## Test Execution Time Estimates

| Test Type | Commands | Est. Time |
|-----------|----------|-----------|
| Navigation | 10-15 | 15-20s |
| Study Session | 20-30 | 30-45s |
| Search Flow | 8-12 | 10-15s |
| Full Suite | 50-75 | 2-3 min |

---

## Next Steps

### Phase 4A: Core Tests (2 hours)
1. ✅ Install Maestro
2. Create `__maestro__/` directory
3. Write navigation test
4. Write study session test
5. Write search test

### Phase 4B: Advanced Tests (2 hours)
1. Add favorites test
2. Add progress tracking test
3. Add streak verification test
4. Add error handling tests

### Phase 4C: CI Integration (1 hour)
1. Set up GitHub Actions
2. Configure test reports
3. Add failure notifications
4. Test on multiple devices

---

## Troubleshooting

### Maestro won't launch
```bash
# Check installation
which maestro

# Reinstall if needed
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### App not found
```bash
# Verify app is built
ls ios/build/
ls android/app/build/

# Check appId in config.yaml
```

### Tests timing out
```yaml
# Increase timeout for slow operations
- tapOn: "Submit"
  timeout: 10000
```

---

## Resources

### Documentation
- [Maestro Official Docs](https://maestro.mobile.dev/)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Maestro Examples](https://maestro.mobile.dev/examples)

### Community
- [Maestro Discord](https://discord.gg/maestro)
- [Maestro Twitter](https://twitter.com/mobile_dev_hq)

### Related Files
- `__maestro__/*.yaml` - Test files
- `MAESTRO_SETUP.md` - This guide (you are here)
- `README-TESTING.md` - Overall testing strategy

---

## Sample Test Suite for Your App

Here's a complete test suite structure:

```
__maestro__/
├── config.yaml                      # App configuration
├── 01-navigation.yaml              # Tab navigation
├── 02-study-session.yaml           # Complete study flow
├── 03-library-search.yaml          # Search functionality
├── 04-favorites.yaml               # Favorite management
├── 05-progress-tracking.yaml       # Stats verification
├── 06-streak-updates.yaml          # Streak calculation
├── 07-error-handling.yaml          # Error scenarios
└── flows/
    ├── common.yaml                  # Reusable flows
    └── helpers.yaml                 # Helper commands
```

---

## Success Criteria

Your E2E tests should cover:
- ✅ All navigation paths
- ✅ Critical user flows (study, search, track)
- ✅ Data persistence (AsyncStorage)
- ✅ Error states
- ✅ Happy paths + edge cases

**Target**: 90%+ user flow coverage with <5 min total execution time

---

*Ready to make your app fully autonomous with E2E testing!* 🤖✨

---

**Last Updated**: 2025-11-10
**Status**: Ready for Implementation 🚀
**Estimated Time**: 4-5 hours for complete setup
