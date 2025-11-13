@echo off
REM ========================================
REM Healthcare Vocab App - Automated iOS Test
REM ========================================
REM
REM This script automatically:
REM 1. Kills any existing Metro servers
REM 2. Starts Expo for iOS testing
REM 3. Shows QR code for Expo Go
REM 4. Displays iOS-specific verification checklist
REM 5. Allows manual verification
REM
REM Purpose: Quick iOS testing between development sessions
REM ========================================

echo.
echo ========================================
echo   Automated iOS Testing
echo ========================================
echo.

REM Step 1: Kill existing Metro servers (only on port 8081)
echo [1/4] Cleaning up old Metro servers...
echo       Checking for processes on port 8081...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Found process %%a on port 8081, stopping it...
    taskkill //F //PID %%a 2>nul
)
echo       ✓ Port 8081 is now available
echo.

REM Step 2: Clear Metro cache for clean build
echo [2/4] Clearing Metro cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache 2>nul
    echo       ✓ Metro cache cleared
) else (
    echo       • Metro cache already clean
)
echo.

REM Step 3: Start Expo with QR code
echo [3/4] Starting Expo with QR code...
echo       A new terminal window will open!
echo.
REM NOTE: Starting Metro in NEW terminal so QR code is visible
REM Do NOT use /B flag or --ios flag (they hide QR code)
start "Metro - iOS Testing - Scan QR Code Here!" npx expo start --clear

REM Step 4: Brief wait for Metro to start
echo [4/4] Waiting for Metro to start...
timeout /t 5 /nobreak >nul
echo       ✓ Metro started in new window
echo       ✓ Look for the QR code in the "Metro" window!
echo.

REM Instructions
echo ========================================
echo   HOW TO CONNECT YOUR iOS DEVICE
echo ========================================
echo.
echo OPTION 1: Physical iPhone with Expo Go
echo   1. Install "Expo Go" from the App Store (if not installed)
echo   2. Look at the "Metro" terminal window for the QR code
echo   3. Open the Expo Go app on your iPhone
echo   4. Tap "Scan QR code"
echo   5. Point your camera at the QR code in the Metro window
echo   6. Wait 30-60 seconds for the app to load
echo.
echo OPTION 2: iOS Simulator (Mac only)
echo   1. Go to the "Metro" terminal window
echo   2. Press 'i' to launch the iOS Simulator
echo   3. Wait for simulator to launch and app to load
echo   4. NOTE: Windows cannot run iOS Simulator
echo.
echo The Metro terminal is running in a separate window.
echo Look for the window titled "Metro - iOS Testing"!
echo.

REM Verification checklist
echo ========================================
echo   VERIFICATION CHECKLIST (iOS)
echo ========================================
echo.
echo [APP LOADING]
echo [ ] App loads in Expo Go (no red error screen)
echo [ ] No JavaScript errors displayed
echo [ ] Loading completes within 60 seconds
echo.
echo [NAVIGATION]
echo [ ] Bottom tabs visible: Home, Learn, Library, Progress, Debug
echo [ ] Learn tab is accessible and loads properly
echo [ ] Tab switching works smoothly
echo.
echo [CARD LAYOUT]
echo [ ] Centered white card with medical term
echo [ ] Card has proper shadow and rounded corners
echo [ ] Card is scrollable (for long content)
echo [ ] All content visible: term, pronunciation, definition, examples
echo.
echo [ACTION BUTTONS]
echo [ ] 4 buttons at BOTTOM of card (inside white card)
echo [ ] Know It (green), Don't Know (red), Save (amber), Share (teal)
echo [ ] Icons render properly (SVG icons, not broken squares)
echo [ ] Button labels visible: "Know It", "Don't Know", "Save", "Share"
echo [ ] All buttons are tappable
echo.
echo [INTERACTIONS]
echo [ ] Swipe LEFT works (advances to next card)
echo [ ] Swipe RIGHT works (goes to previous card)
echo [ ] Swipe animation is smooth (no lag/stutter)
echo [ ] Haptic feedback on swipes (phone vibrates lightly)
echo [ ] Know It button advances card
echo [ ] Don't Know button advances card
echo [ ] Save button toggles bookmark icon (outline ↔ filled)
echo [ ] Share button opens native iOS share sheet
echo [ ] "Show More" expands additional content
echo [ ] "Show Less" collapses content
echo.
echo [iOS-SPECIFIC FEATURES]
echo [ ] Safe area respected (no overlap with notch/home indicator)
echo [ ] Status bar displays correctly
echo [ ] Haptic feedback works on button taps
echo [ ] Share sheet shows iOS-native UI
echo [ ] No Unicode/emoji rendering issues (all SVG)
echo [ ] Smooth 60fps animations
echo [ ] No memory warnings or crashes
echo.
echo [VISUAL POLISH]
echo [ ] Typography renders clearly (serif font for terms)
echo [ ] Colors match design: cream background, white card, accent colors
echo [ ] Adequate spacing, not cramped
echo [ ] Button shadows visible
echo [ ] Border radius on card and buttons
echo.
echo If you see errors, check ios-test-output.txt for Metro logs.
echo.
echo ========================================
echo   When finished testing:
echo ========================================
echo.
echo Press any key to STOP the Metro server
echo and close this window.
echo.
pause >nul

REM Cleanup: Kill Metro server (only the one on port 8081!)
echo.
echo Stopping Metro server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
    echo       Stopping process %%a on port 8081...
    taskkill //F //PID %%a 2>nul
)
echo ✓ Metro server stopped
echo.
echo Cleanup complete. Goodbye!
timeout /t 2 /nobreak >nul
