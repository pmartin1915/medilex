@echo off
REM ========================================
REM Healthcare Vocab App - Auto Git Sync
REM ========================================
REM
REM This script automatically:
REM 1. Pulls latest code from remote
REM 2. Handles merge conflicts automatically
REM 3. Pushes any local changes
REM
REM Purpose: Easy git sync without manual commands
REM ========================================

echo.
echo ========================================
echo   Git Sync - Automated Pull/Push
echo ========================================
echo.

REM Step 1: Check current branch
echo [1/4] Checking current branch...
for /f "tokens=*" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b
echo       Current branch: %CURRENT_BRANCH%
echo.

REM Step 2: Pull latest code
echo [2/4] Pulling latest code from remote...
echo       Running: git pull origin %CURRENT_BRANCH%
echo.
git pull origin %CURRENT_BRANCH% 2>&1

if %ERRORLEVEL% neq 0 (
    echo.
    echo       ⚠️  Pull had conflicts or errors
    echo       Attempting auto-resolution...
    echo.

    REM Try to auto-resolve with --theirs strategy
    echo       Using --theirs strategy to favor remote changes...
    git checkout --theirs .
    git add .

    echo       Creating merge commit...
    git commit -m "Auto-merge: resolved conflicts favoring remote changes" 2>nul

    if %ERRORLEVEL%==0 (
        echo       ✓ Auto-merge successful!
    ) else (
        echo       • No merge needed
    )
) else (
    echo       ✓ Pull successful - no conflicts
)
echo.

REM Step 3: Check for local changes to push
echo [3/4] Checking for local changes to push...
git status --porcelain >nul 2>&1
if %ERRORLEVEL%==0 (
    for /f %%i in ('git status --porcelain ^| find /c /v ""') do set CHANGES=%%i
    if !CHANGES! gtr 0 (
        echo       Found !CHANGES! uncommitted change(s)
        echo       ⚠️  You have uncommitted changes - commit them first
        echo.
        echo       To commit and push:
        echo       1. git add .
        echo       2. git commit -m "Your message"
        echo       3. git push
        echo.
        goto end
    )
)

REM Check for commits to push
for /f %%i in ('git rev-list @{u}.. --count') do set COMMITS_TO_PUSH=%%i
if %COMMITS_TO_PUSH% gtr 0 (
    echo       Found %COMMITS_TO_PUSH% commit(s) to push
) else (
    echo       ✓ No local commits to push
)
echo.

REM Step 4: Push if needed
if %COMMITS_TO_PUSH% gtr 0 (
    echo [4/4] Pushing local commits to remote...
    echo       Running: git push origin %CURRENT_BRANCH%
    echo.
    git push origin %CURRENT_BRANCH%

    if %ERRORLEVEL%==0 (
        echo       ✓ Push successful!
    ) else (
        echo       ✗ Push failed - check error above
    )
) else (
    echo [4/4] Nothing to push
    echo       ✓ Already up to date with remote
)
echo.

:end
echo ========================================
echo   Git Sync Complete!
echo ========================================
echo.
echo Current status:
git status -sb
echo.
echo Press any key to close...
pause >nul
