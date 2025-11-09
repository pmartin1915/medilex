@echo off
echo ========================================
echo Resolving Merge Conflicts
echo ========================================
echo.
echo This will accept the incoming changes (the new code with vertical swipe)
echo and discard any local conflicting changes.
echo.
pause

echo [1/3] Resolving conflicts by accepting incoming changes...
git checkout --theirs src/screens/LearnScreen.tsx
git checkout --theirs src/components/SwipeableCard.tsx
git checkout --theirs troubleshoot.bat

echo [2/3] Marking conflicts as resolved...
git add src/screens/LearnScreen.tsx
git add src/components/SwipeableCard.tsx
git add troubleshoot.bat
git add GET_LATEST_CODE.bat
git add QUICK_FIX_ALL_PLATFORMS.bat
git add PLATFORM_FIXES.md

echo [3/3] Completing the merge...
git commit -m "Merge: Accept incoming changes with vertical swipe feature"

echo.
echo ========================================
echo Conflicts resolved!
echo ========================================
echo.
echo Next step: Clear caches and restart Metro
echo Run: npx expo start --clear
echo.
pause
