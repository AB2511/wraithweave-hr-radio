@echo off
REM WraithWeave GitHub Push Script for Windows
REM This script will push your code to GitHub safely

echo.
echo 🎃 WraithWeave GitHub Push Script
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found!
    echo Please run this script from the wraithweave-core directory
    pause
    exit /b 1
)

echo ✅ In correct directory (wraithweave-core)
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)
echo.

REM Add remote if not exists
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo 🔗 Adding remote repository...
    git remote add origin https://github.com/AB2511/wraithweave-hr-radio.git
    echo ✅ Remote added
) else (
    echo ✅ Remote already exists
    echo Current remote:
    git remote -v
)
echo.

REM Check what will be committed
echo 📋 Files to be committed:
echo ------------------------
git status --short
echo.

REM Add all files
echo ➕ Adding files...
git add .
echo ✅ Files added
echo.

REM Show what's staged
echo 📦 Staged files (first 20):
git diff --cached --name-only | more
echo.

REM Commit
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" (
    set commit_msg=feat: Complete WraithWeave implementation with speech recognition and horror effects
)

echo 💾 Committing with message: %commit_msg%
git commit -m "%commit_msg%"
echo ✅ Committed
echo.

REM Determine branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
if "%current_branch%"=="" (
    echo 🌿 Creating main branch...
    git checkout -b main
    set current_branch=main
)

echo 📤 Pushing to origin/%current_branch%...
git push -u origin %current_branch%

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🎉 Your repository is now live at:
    echo    https://github.com/AB2511/wraithweave-hr-radio
    echo.
    echo Next steps:
    echo 1. Visit the repository and verify all files are there
    echo 2. Add a description and topics on GitHub
    echo 3. Upload a demo video/GIF
    echo 4. Create a release for the contest submission
) else (
    echo.
    echo ❌ Push failed!
    echo Please check the error message above and try again.
    echo.
    echo Common fixes:
    echo - If authentication failed, check your GitHub credentials
    echo - If rejected, try: git pull origin %current_branch% --rebase
    echo - If force push needed: git push -f origin %current_branch%
)

echo.
pause