@echo off
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Verify Android Automation System Installation             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set PASS=0
set FAIL=0

echo [1/7] Checking script files...
if exist "test-android-auto.bat" (
    echo   ✓ test-android-auto.bat
    set /a PASS+=1
) else (
    echo   ✗ test-android-auto.bat MISSING
    set /a FAIL+=1
)

if exist "analyze-android-errors.js" (
    echo   ✓ analyze-android-errors.js
    set /a PASS+=1
) else (
    echo   ✗ analyze-android-errors.js MISSING
    set /a FAIL+=1
)

if exist "test-android-complete.bat" (
    echo   ✓ test-android-complete.bat
    set /a PASS+=1
) else (
    echo   ✗ test-android-complete.bat MISSING
    set /a FAIL+=1
)

echo.
echo [2/7] Checking documentation...
if exist "ANDROID_TESTING_GUIDE.md" (
    echo   ✓ ANDROID_TESTING_GUIDE.md
    set /a PASS+=1
) else (
    echo   ✗ ANDROID_TESTING_GUIDE.md MISSING
    set /a FAIL+=1
)

if exist "ANDROID_TESTING_QUICK_REF.txt" (
    echo   ✓ ANDROID_TESTING_QUICK_REF.txt
    set /a PASS+=1
) else (
    echo   ✗ ANDROID_TESTING_QUICK_REF.txt MISSING
    set /a FAIL+=1
)

if exist "ANDROID_AUTOMATION_COMPLETE.md" (
    echo   ✓ ANDROID_AUTOMATION_COMPLETE.md
    set /a PASS+=1
) else (
    echo   ✗ ANDROID_AUTOMATION_COMPLETE.md MISSING
    set /a FAIL+=1
)

echo.
echo [3/7] Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Node.js installed
    node --version
    set /a PASS+=1
) else (
    echo   ✗ Node.js NOT installed
    echo     Required for error analysis
    set /a FAIL+=1
)

echo.
echo [4/7] Checking Android SDK...
if defined ANDROID_HOME (
    echo   ✓ ANDROID_HOME set: %ANDROID_HOME%
    set /a PASS+=1
) else (
    echo   ✗ ANDROID_HOME not set
    echo     Run: setup-android-env.bat
    set /a FAIL+=1
)

echo.
echo [5/7] Checking ADB...
where adb >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ ADB accessible
    adb version | findstr "Android"
    set /a PASS+=1
) else (
    echo   ✗ ADB not in PATH
    echo     Run: setup-android-env.bat
    set /a FAIL+=1
)

echo.
echo [6/7] Checking emulator...
where emulator >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Emulator accessible
    set /a PASS+=1
) else (
    echo   ✗ Emulator not in PATH
    echo     Run: setup-android-env.bat
    set /a FAIL+=1
)

echo.
echo [7/7] Checking available AVDs...
emulator -list-avds 2>nul | findstr /r "." >nul
if %errorlevel% equ 0 (
    echo   ✓ AVDs found:
    emulator -list-avds 2>nul
    set /a PASS+=1
) else (
    echo   ✗ No AVDs found
    echo     Create emulator in Android Studio
    set /a FAIL+=1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo VERIFICATION RESULTS:
echo   Passed: %PASS%/12
echo   Failed: %FAIL%/12
echo.

if %FAIL% equ 0 (
    echo ✓ ALL CHECKS PASSED!
    echo.
    echo Your Android automation system is ready to use.
    echo.
    echo Quick start:
    echo   .\test-android-complete.bat
    echo.
    echo Documentation:
    echo   ANDROID_TESTING_GUIDE.md
    echo   ANDROID_TESTING_QUICK_REF.txt
    echo.
) else (
    echo ⚠ SOME CHECKS FAILED
    echo.
    echo Please fix the issues above before using the automation system.
    echo.
    if not defined ANDROID_HOME (
        echo Priority: Run setup-android-env.bat to configure Android SDK
    )
    echo.
)

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
pause
