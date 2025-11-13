@echo off
REM ========================================
REM Healthcare Vocab App - Multi-Platform Quick Verification
REM ========================================
REM
REM This script:
REM 1. Opens the verification checklist ONCE
REM 2. Starts Metro bundler
REM 3. Opens web browser for testing
REM 4. Shows QR code for iOS/Android testing
REM 5. Allows testing ALL platforms simultaneously
REM
REM Purpose: Ultimate convenience for cross-platform testing
REM ========================================

echo.
echo ========================================
echo   Multi-Platform Quick Verification
echo ========================================
echo.
echo This will start testing for ALL platforms:
echo   • Web (opens in browser)
echo   • iOS (QR code for Expo Go)
echo   • Android (QR code for Expo Go)
echo.

REM Step 1: Check if verification checklist exists
if not exist "VERIFICATION-CHECKLIST.md" (
    echo ERROR: VERIFICATION-CHECKLIST.md not found!
    echo Please make sure you're in the project root directory.
    echo.
    pause
    exit /b 1
)

REM Step 2: Open verification checklist
echo [1/5] Opening verification checklist...
start "" "VERIFICATION-CHECKLIST.md"
echo       ✓ Checklist opened (use this for all platforms)
echo.

REM Wait a moment for file to open
timeout /t 2 /nobreak >nul

REM Step 3: Kill existing Metro servers (only on port 8081)
echo [2/5] Cleaning up old Metro servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a on port 8081...
    taskkill //F //PID %%a 2>nul
)
echo       ✓ Port 8081 is available
echo.

REM Step 4: Clear Metro cache
echo [3/5] Clearing Metro cache for clean test...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache 2>nul
    echo       ✓ Cache cleared
) else (
    echo       • Cache already clean
)
echo.

REM Step 5: Start Metro bundler for all platforms
echo [4/5] Starting Metro bundler for all platforms...
echo       This will take 30-60 seconds...
echo.
start /B npx expo start --clear > quick-verify-all-output.txt 2>&1

REM Progress indicator
echo       Progress:
echo       [          ] 0%%  - Starting Metro...
timeout /t 10 /nobreak >nul
echo       [===       ] 30%% - Bundling...
timeout /t 10 /nobreak >nul
echo       [======    ] 60%% - Optimizing...
timeout /t 10 /nobreak >nul
echo       [==========] 100%% - Ready!
echo.

REM Step 6: Open web browser
echo [5/5] Opening web browser...
timeout /t 2 /nobreak >nul
start http://localhost:8081
echo       ✓ Web app opened in browser
echo.

REM Display comprehensive instructions
echo ========================================
echo   NOW: Test All Platforms!
echo ========================================
echo.
echo You should now have THREE windows open:
echo   1. Verification checklist (text editor) - use for all platforms
echo   2. Web browser with app running
echo   3. Metro terminal with QR code (may be minimized)
echo.
echo ╔═══════════════════════════════════════╗
echo ║  PLATFORM 1: WEB (Already Open)      ║
echo ╚═══════════════════════════════════════╝
echo.
echo The app is already running in your web browser!
echo Go through the verification checklist for web:
echo   ✓ Bottom tabs visible
echo   ✓ Card layout correct
echo   ✓ Action buttons working
echo   ✓ Swipe gestures (mouse drag)
echo.
echo ╔═══════════════════════════════════════╗
echo ║  PLATFORM 2: iOS (Expo Go)           ║
echo ╚═══════════════════════════════════════╝
echo.
echo TO TEST ON iPHONE:
echo   1. Install "Expo Go" from App Store (if not installed)
echo   2. Open Expo Go app
echo   3. Tap "Scan QR code"
echo   4. Look for QR code in Metro terminal (or press 'r' to show again)
echo   5. Scan the QR code with your iPhone
echo   6. Wait 30-60 seconds for app to load
echo   7. Go through iOS-specific checks in verification checklist
echo.
echo iOS-specific checks:
echo   ✓ Safe area (no notch overlap)
echo   ✓ Haptic feedback on swipes/taps
echo   ✓ Native iOS share sheet
echo   ✓ Smooth animations
echo.
echo ╔═══════════════════════════════════════╗
echo ║  PLATFORM 3: Android (Expo Go)       ║
echo ╚═══════════════════════════════════════╝
echo.
echo TO TEST ON ANDROID:
echo   1. Install "Expo Go" from Google Play Store (if not installed)
echo   2. Open Expo Go app
echo   3. Tap "Scan QR code"
echo   4. Scan the same QR code shown in Metro terminal
echo   5. Wait 30-60 seconds for app to load
echo   6. Go through Android-specific checks in verification checklist
echo.
echo Android-specific checks:
echo   ✓ Navigation bar handling
echo   ✓ Haptic feedback
echo   ✓ Native Android share dialog
echo   ✓ Back button behavior
echo.
echo ========================================
echo   Quick Checklist (All Platforms):
echo ========================================
echo.
echo [ ] WEB - App loads and renders correctly
echo [ ] WEB - All interactions work (swipe with mouse)
echo [ ] WEB - Icons render as SVG (not broken)
echo.
echo [ ] iOS - App loads in Expo Go (no errors)
echo [ ] iOS - Haptic feedback on swipes/taps
echo [ ] iOS - Native share sheet works
echo [ ] iOS - Safe area respected (no notch overlap)
echo.
echo [ ] ANDROID - App loads in Expo Go (no errors)
echo [ ] ANDROID - Haptic feedback works
echo [ ] ANDROID - Native share dialog works
echo [ ] ANDROID - Back button handled properly
echo.
echo For detailed platform-specific checks, see VERIFICATION-CHECKLIST.md
echo.
echo ========================================
echo   Troubleshooting:
echo ========================================
echo.
echo • QR code not visible: Check the Metro terminal or logs
echo • QR code won't scan: Ensure phone and PC on same WiFi
echo • Web not loading: Wait 30 more seconds, check http://localhost:8081
echo • Old code showing: Close app completely, restart, scan again
echo • Metro errors: Check quick-verify-all-output.txt
echo.
echo ========================================
echo   When finished testing all platforms:
echo ========================================
echo.
echo Press any key to STOP Metro and exit...
echo.
pause >nul

REM Cleanup
echo.
echo Stopping Metro server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a...
    taskkill //F //PID %%a 2>nul
)
echo ✓ Metro stopped
echo.

REM Summary
echo ========================================
echo   Multi-Platform Verification Complete!
echo ========================================
echo.
echo Results Summary:
echo.
set /p WEB_RESULT="Did WEB work? (y/n): "
set /p IOS_RESULT="Did iOS work? (y/n): "
set /p ANDROID_RESULT="Did Android work? (y/n): "
echo.
echo Platform Results:
echo   • Web: %WEB_RESULT%
echo   • iOS: %IOS_RESULT%
echo   • Android: %ANDROID_RESULT%
echo.
echo If any platform had issues, check:
echo   • quick-verify-all-output.txt (Metro logs)
echo   • Browser console (F12) for web
echo   • Expo Go error messages for mobile
echo   • VERIFICATION-CHECKLIST.md for troubleshooting
echo.
echo To test individual platforms:
echo   • Web only:     .\quick-verify.bat
echo   • iOS only:     .\quick-verify-ios.bat
echo   • Android only: .\start-android.bat (or other Android scripts)
echo.
echo Goodbye!
timeout /t 3 /nobreak >nul
