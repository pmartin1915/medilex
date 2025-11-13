@echo off
REM ========================================
REM Healthcare Vocab App - Quick iOS Verification
REM ========================================
REM
REM This script:
REM 1. Opens the verification checklist
REM 2. Starts Metro and shows QR code for Expo Go
REM 3. Optionally launches iOS Simulator
REM 4. Allows side-by-side verification on iOS
REM
REM Purpose: Quick iOS testing for both user and AI
REM ========================================

echo.
echo ========================================
echo   Quick iOS Verification Helper
echo ========================================
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
echo       ✓ Checklist opened
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

REM Step 5: Ask user how they want to test
echo [4/5] iOS Testing Options:
echo.
echo   [1] Physical iPhone with Expo Go (QR code)
echo   [2] iOS Simulator (if installed on Mac)
echo   [3] Both (QR + Simulator)
echo.
set /p CHOICE="Enter choice (1-3): "
echo.

if "%CHOICE%"=="2" goto SIMULATOR
if "%CHOICE%"=="3" goto BOTH
goto QR_ONLY

:QR_ONLY
echo Selected: Physical iPhone with Expo Go
echo.
goto START_METRO

:SIMULATOR
echo Selected: iOS Simulator
echo.
echo NOTE: iOS Simulator requires Xcode on macOS.
echo       If you're on Windows, use option 1 instead.
echo.
goto START_METRO

:BOTH
echo Selected: Both QR code and Simulator
echo.
goto START_METRO

:START_METRO
REM Step 6: Start Metro bundler
echo [5/5] Starting Metro bundler with QR code...
echo       A new terminal window will open with the QR code!
echo.
REM NOTE: Starting Metro in a NEW visible terminal so QR code is visible
REM Do NOT use /B flag or --ios/--android flags (they hide QR code)
start "Metro - Scan QR Code Here!" npx expo start --clear

REM Brief wait for Metro to start
timeout /t 5 /nobreak >nul
echo.
echo       ✓ Metro started in new window
echo       ✓ Look for the QR code in the "Metro" window!
echo.

REM Display instructions based on choice
echo ========================================
echo   NOW: Connect Your iOS Device!
echo ========================================
echo.

if "%CHOICE%"=="1" goto SHOW_QR_INSTRUCTIONS
if "%CHOICE%"=="2" goto SHOW_SIMULATOR_INSTRUCTIONS
if "%CHOICE%"=="3" goto SHOW_BOTH_INSTRUCTIONS

:SHOW_QR_INSTRUCTIONS
echo You should now have THREE windows open:
echo   1. Verification checklist (text editor)
echo   2. This terminal (instructions)
echo   3. Metro terminal with QR code
echo.
echo TO CONNECT YOUR iPHONE:
echo   1. Install "Expo Go" from the App Store (if not installed)
echo   2. Look at the "Metro" terminal window for the QR code
echo   3. Open Expo Go app on your iPhone
echo   4. Tap "Scan QR code"
echo   5. Point camera at the QR code in the Metro window
echo   6. Wait for app to load (30-60 seconds first time)
echo.
goto SHOW_CHECKLIST

:SHOW_SIMULATOR_INSTRUCTIONS
echo You should now have TWO windows open:
echo   1. Verification checklist (text editor)
echo   2. This terminal with Metro bundler
echo.
echo TO USE iOS SIMULATOR:
echo   1. The simulator should launch automatically
echo   2. If not, press 'i' in the Metro terminal
echo   3. Or manually open Xcode Simulator
echo   4. Wait for app to load (30-60 seconds first time)
echo.
echo NOTE: Windows does not support iOS Simulator.
echo       Use a Mac or choose option 1 (physical iPhone).
echo.
goto SHOW_CHECKLIST

:SHOW_BOTH_INSTRUCTIONS
echo You should now have THREE windows open:
echo   1. Verification checklist (text editor)
echo   2. This terminal (instructions)
echo   3. Metro terminal with QR code
echo.
echo OPTION A - PHYSICAL iPHONE:
echo   1. Install "Expo Go" from App Store
echo   2. Look at the Metro terminal for the QR code
echo   3. Open Expo Go and scan the QR code
echo   4. Wait for app to load
echo.
echo OPTION B - iOS SIMULATOR (Mac only):
echo   1. Go to the Metro terminal window
echo   2. Press 'i' to launch simulator
echo   3. Or open Xcode Simulator manually
echo   4. Wait for app to load
echo.
goto SHOW_CHECKLIST

:SHOW_CHECKLIST
echo ========================================
echo   Quick Verification Items (iOS):
echo ========================================
echo.
echo [ ] App loads in Expo Go (no red error screen)
echo [ ] Bottom tabs visible (5 tabs)
echo [ ] Learn tab loads
echo [ ] Centered white card displays
echo [ ] 4 action buttons at BOTTOM of card
echo [ ] Icons render properly (not broken/squares)
echo [ ] Button labels readable: "Know It", "Don't Know", "Save", "Share"
echo [ ] Buttons are tappable and respond
echo [ ] Swipe LEFT works (next card)
echo [ ] Swipe RIGHT works (previous card)
echo [ ] Haptic feedback on swipes (phone vibrates lightly)
echo [ ] Content scrollable within card
echo [ ] "Show More" button expands content
echo.
echo iOS-SPECIFIC CHECKS:
echo [ ] Smooth animations (no lag/stutter)
echo [ ] Safe area respected (no notch overlap)
echo [ ] Share button opens native iOS share sheet
echo [ ] No Unicode emoji issues (all SVG icons)
echo [ ] Haptic feedback works on button taps
echo.
echo For detailed checklist, see the opened file.
echo.
echo ========================================
echo   When finished:
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
echo   iOS Verification Complete!
echo ========================================
echo.
echo If you found any issues, check:
echo   • quick-verify-ios-output.txt (Metro logs)
echo   • Expo Go app error messages
echo   • VERIFICATION-CHECKLIST.md (iOS section)
echo   • HANDOFF.md (current state)
echo.
echo To run iOS verification again:
echo   .\quick-verify-ios.bat
echo.
echo To test on web instead:
echo   .\quick-verify.bat
echo.
echo To test all platforms:
echo   .\quick-verify-all.bat
echo.
echo Goodbye!
timeout /t 2 /nobreak >nul
