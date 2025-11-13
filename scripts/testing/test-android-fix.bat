@echo off
echo ========================================
echo Testing Android Fix
echo ========================================
echo.

echo [1/5] Checking for circular dependencies...
call npx madge --circular --extensions ts,tsx src/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Circular dependencies found!
    pause
    exit /b 1
)
echo ✓ No circular dependencies
echo.

echo [2/5] Checking for react-native-screens...
call npm ls react-native-screens
if %ERRORLEVEL% EQU 0 (
    echo WARNING: react-native-screens is installed
    echo This was the cause of the iOS issue
) else (
    echo ✓ react-native-screens not installed
)
echo.

echo [3/5] Verifying TypeScript compilation...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: TypeScript compilation failed!
    pause
    exit /b 1
)
echo ✓ TypeScript compilation successful
echo.

echo [4/5] Checking errorLogger imports...
findstr /s /i "import.*errorLogger" src\*.tsx src\*.ts | findstr /v "getErrorLogger"
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Found direct errorLogger imports (should use getErrorLogger)
) else (
    echo ✓ All files use getErrorLogger
)
echo.

echo [5/5] Starting Metro bundler with clear cache...
echo.
echo ========================================
echo Fix verification complete!
echo ========================================
echo.
echo Next steps:
echo 1. Metro bundler will start
echo 2. Scan QR code in Expo Go on Android
echo 3. Verify app loads past grey screen
echo 4. Check all 5 tabs work
echo 5. Go to Debug tab and run self-tests
echo.
echo Press any key to start Metro bundler...
pause > nul

npx expo start --clear
