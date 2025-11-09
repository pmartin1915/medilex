@echo off
REM ========================================
REM Start Healthcare Vocab App for Mobile Testing
REM ========================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Healthcare Vocab App - Mobile Testing (SDK 54)           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Starting Expo Metro Bundler...
echo.
echo NEXT STEPS:
echo   1. Wait for QR code to appear below
echo   2. Open Expo Go app on your iPhone
echo   3. Scan the QR code
echo   4. App will launch on your phone!
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start Expo for mobile testing
npx expo start

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Metro bundler stopped.
echo.
pause
