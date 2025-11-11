@echo off
REM Simple Android starter - just sets paths and runs expo

set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo Starting Healthcare Vocab App on Android...
echo.

npx expo start --android
