@echo off
echo ========================================
echo Verify Android Setup
echo ========================================
echo.

echo Checking ANDROID_HOME...
if defined ANDROID_HOME (
    echo ✓ ANDROID_HOME is set to: %ANDROID_HOME%
) else (
    echo ✗ ANDROID_HOME is NOT set!
    echo   Run: setup-android-env.bat
)
echo.

echo Checking if ADB is accessible...
where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ ADB found in PATH
    adb version
) else (
    echo ✗ ADB not found in PATH!
    echo   Run: setup-android-env.bat
)
echo.

echo Checking if emulator is accessible...
where emulator >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Emulator found in PATH
    emulator -version
) else (
    echo ✗ Emulator not found in PATH!
    echo   Run: setup-android-env.bat
)
echo.

echo Checking for running emulators...
adb devices
echo.

echo ========================================
if defined ANDROID_HOME (
    echo Status: Ready! You can run "npm start"
) else (
    echo Status: Setup needed - run setup-android-env.bat
)
echo ========================================
echo.
pause
