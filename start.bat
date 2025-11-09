@echo off
REM Simple wrapper to ensure ANDROID_HOME is set before running Expo
REM This fixes the "path not found" error when running npx expo start directly

echo Setting Android SDK paths...
set ANDROID_HOME=D:\Android\Sdk
set PATH=%PATH%;D:\Android\Sdk\platform-tools;D:\Android\Sdk\emulator

echo Starting Expo...
npx expo start %*
