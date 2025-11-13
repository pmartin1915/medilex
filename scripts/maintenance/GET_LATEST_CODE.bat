@echo off
echo ========================================
echo Getting Latest Code with Vertical Swipe
echo ========================================
echo.

echo [Step 1/5] Checking current branch...
git branch
echo.

echo [Step 2/5] Fetching latest changes from remote...
git fetch origin
echo.

echo [Step 3/5] Switching to the correct branch...
git checkout claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB
echo.

echo [Step 4/5] Pulling latest changes...
git pull origin claude/healthcare-vocab-app-011CUxRXAghizNMCKbQxtZDB
echo.

echo [Step 5/5] Verifying the changes...
echo.
echo Looking for vertical swipe in LearnScreen.tsx:
findstr /C:"handleSwipeUp" src\screens\LearnScreen.tsx
findstr /C:"handleSwipeDown" src\screens\LearnScreen.tsx
echo.
echo Looking for vertical swipe in SwipeableCard.tsx:
findstr /C:"onSwipeUp" src\components\SwipeableCard.tsx
findstr /C:"VERTICAL_SWIPE_THRESHOLD" src\components\SwipeableCard.tsx
echo.

echo ========================================
echo Done! Latest code is now on your machine.
echo ========================================
echo.
echo Next steps:
echo 1. Clear caches and start fresh
echo 2. For iOS: npx expo start --clear
echo 3. For Android: Fix the emulator PATH first (see instructions below)
echo 4. For Web: npm run web
echo.
pause
