@echo off
echo Testing iOS fix...
echo.
echo 1. Checking if react-native-screens is gone:
npm ls react-native-screens
echo.
echo 2. Checking package.json for native-stack:
findstr "native-stack" package.json
echo.
echo 3. Testing basic app compilation:
npx expo export --platform ios --output-dir temp-test --clear
echo.
echo Test complete! Check output above.
pause