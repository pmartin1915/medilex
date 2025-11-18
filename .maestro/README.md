# Maestro E2E Testing Guide

This directory contains End-to-End (E2E) tests for the Healthcare Vocabulary App using [Maestro](https://maestro.mobile.dev/), a mobile UI testing framework.

## 📋 Overview

**6 E2E Test Flows:**
1. `01-complete-study-session.yaml` - Core learning flow with flashcards
2. `02-search-and-favorite.yaml` - Library search and favorite functionality
3. `03-view-progress.yaml` - Progress statistics validation
4. `04-seven-day-streak.yaml` - Streak tracking mechanics
5. `05-error-recovery.yaml` - Graceful error handling
6. `06-first-time-onboarding.yaml` - Fresh install experience

## 🚀 Installation

### Prerequisites

**Required:**
- Java 17 or higher (verify with `java -version`)
- Android SDK (for Android testing)
- Xcode (for iOS testing, macOS only)
- Android Emulator or physical device
- iOS Simulator or physical device (macOS only)

### Installing Java 17+ on Windows

If you have Java 11 (check with `java -version`), upgrade to Java 17+:

**Option 1: Download OpenJDK 17**
1. Visit https://adoptium.net/
2. Download "Temurin 17 (LTS)" for Windows
3. Run the installer
4. Verify: `java -version` (should show 17.x.x)

**Option 2: Using Chocolatey**
```powershell
choco install openjdk17
```

**Option 3: Using Scoop**
```powershell
scoop install openjdk17
```

### Installing Maestro on Windows

**Method 1: Direct Download (Recommended for Windows)**

1. Download the latest release:
   ```
   https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip
   ```

2. Extract to a permanent location (e.g., `C:\maestro`)

3. Add to PATH:
   ```powershell
   setx PATH "%PATH%;C:\maestro\bin"
   ```

4. Restart your terminal and verify:
   ```bash
   maestro --version
   ```

**Method 2: Windows Subsystem for Linux (WSL2)**

1. Install WSL2:
   ```powershell
   wsl --install
   ```

2. Inside WSL, install Java 17:
   ```bash
   sudo apt update
   sudo apt install openjdk-17-jdk
   ```

3. Install Maestro:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

4. Verify:
   ```bash
   maestro --version
   ```

### Installing Maestro on macOS/Linux

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Verify installation:
```bash
maestro --version
```

## 🧪 Running Tests

### Run All E2E Flows

```bash
cd D:\Medilex\HealthcareVocabApp
maestro test .maestro/flows/
```

### Run Individual Flow

```bash
maestro test .maestro/flows/01-complete-study-session.yaml
```

### Run Specific Flows

```bash
maestro test .maestro/flows/01-complete-study-session.yaml .maestro/flows/02-search-and-favorite.yaml
```

### Run with Continuous Mode (watch for changes)

```bash
maestro test --continuous .maestro/flows/
```

## 📱 Testing on Different Devices

### Android Emulator

1. Start your Android emulator:
   ```bash
   npm run android
   ```

2. Run Maestro tests (auto-detects emulator):
   ```bash
   maestro test .maestro/flows/
   ```

### Physical Android Device

1. Connect device via USB
2. Enable USB debugging
3. Run Maestro tests (auto-detects connected device):
   ```bash
   maestro test .maestro/flows/
   ```

### iOS Simulator (macOS only)

1. Start iOS simulator:
   ```bash
   npm run ios
   ```

2. Run Maestro tests:
   ```bash
   maestro test .maestro/flows/
   ```

### Physical iOS Device (macOS only)

1. Connect device via USB
2. Run Maestro tests:
   ```bash
   maestro test .maestro/flows/
   ```

## 🔍 Test Coverage

### What These Tests Validate

✅ **Core Functionality:**
- Flashcard swipe gestures
- "Know It" / "Don't Know" button responses
- Session completion and streak updates
- Navigation between all 5 tabs

✅ **Search & Filtering:**
- Library search with real-time filtering
- Search result accuracy
- Clear search functionality

✅ **Data Persistence:**
- Favorites/bookmarks persist
- Streak data persists
- Progress tracking works

✅ **User Experience:**
- Smooth tab navigation
- Proper loading states
- Error recovery
- First-time user onboarding

✅ **Edge Cases:**
- Rapid tab switching
- Rapid search input
- App state after errors
- Fresh install experience

## 🐛 Debugging Failed Tests

### View Test Output

Maestro provides detailed logs when tests fail:

```bash
maestro test .maestro/flows/01-complete-study-session.yaml --verbose
```

### Common Issues

**Issue:** `Element not found`
- **Cause:** UI element text or ID changed
- **Fix:** Update YAML selectors to match current UI

**Issue:** `Timeout waiting for element`
- **Cause:** App loading slower than expected
- **Fix:** Increase timeout or add more `waitForAnimationToEnd`

**Issue:** `App not installed`
- **Cause:** App not built or installed on device
- **Fix:** Run `npm run android` or `npm run ios` first

**Issue:** `Java version error`
- **Cause:** Java 11 instead of Java 17+
- **Fix:** Upgrade Java (see Installation section)

### Interactive Debugging

Run Maestro Studio to record and debug tests visually:

```bash
maestro studio
```

## 📊 CI/CD Integration

### GitHub Actions

Add Maestro E2E tests to your CI pipeline (`.github/workflows/ci.yml`):

```yaml
e2e-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Set up Java 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Install Maestro
      run: |
        curl -Ls "https://get.maestro.mobile.dev" | bash
        echo "$HOME/.maestro/bin" >> $GITHUB_PATH

    - name: Set up Android SDK
      uses: android-actions/setup-android@v2

    - name: Run Android Emulator
      uses: reactivecircus/android-emulator-runner@v2
      with:
        api-level: 30
        script: maestro test .maestro/flows/
```

### Local CI Simulation

```bash
# Run all tests in order
maestro test .maestro/flows/01-complete-study-session.yaml
maestro test .maestro/flows/02-search-and-favorite.yaml
maestro test .maestro/flows/03-view-progress.yaml
maestro test .maestro/flows/04-seven-day-streak.yaml
maestro test .maestro/flows/05-error-recovery.yaml
maestro test .maestro/flows/06-first-time-onboarding.yaml
```

## 📸 Screenshot Capture

Maestro can automatically capture screenshots during test execution.

### Capture Screenshots for Store Listings

See `.maestro/flows/capture-screenshots.yaml` (Phase 6) for automated screenshot generation.

### Manual Screenshot Capture

Add to any flow:

```yaml
- screenshot: screenshots/home-screen.png
```

## 🎯 Best Practices

1. **Run E2E tests before each release**
   - Validates all critical user flows
   - Catches regressions early

2. **Keep flows focused and independent**
   - Each flow tests one specific journey
   - Flows should not depend on each other

3. **Use meaningful assertions**
   - Verify key UI elements are visible
   - Check for expected text/content

4. **Handle animations gracefully**
   - Use `waitForAnimationToEnd` liberally
   - Add timeouts for slow operations

5. **Test on multiple devices**
   - Different screen sizes
   - Different OS versions
   - Both Android and iOS

## 📚 Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli/commands)
- [Maestro Studio Guide](https://maestro.mobile.dev/getting-started/maestro-studio)
- [Writing Maestro Tests](https://maestro.mobile.dev/getting-started/writing-your-first-flow)

## 🤝 Contributing

When adding new features to the app:

1. Write a corresponding Maestro flow
2. Test the flow on both Android and iOS
3. Update this README if needed
4. Ensure all flows pass before merging

## ✅ Checklist for Phase 2 Completion

- [x] Create `.maestro/flows/` directory
- [x] Write all 6 E2E test flows
- [x] Document installation instructions
- [ ] Install Maestro CLI (requires Java 17+)
- [ ] Run all flows on Android emulator
- [ ] Run all flows on iOS simulator (macOS only)
- [ ] Integrate with CI/CD pipeline
- [ ] Verify 100% flow pass rate

---

**Status:** 6/6 flows created, awaiting Java 17+ installation to execute tests.

**Next Steps:**
1. Upgrade Java to 17+ (see Installation section)
2. Install Maestro CLI
3. Run all flows locally: `maestro test .maestro/flows/`
4. Fix any failing tests
5. Integrate with GitHub Actions
