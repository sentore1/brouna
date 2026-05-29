@echo off
echo ========================================
echo Clean Reinstall of Next.js Project
echo ========================================
echo.

echo Step 1: Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Removing node_modules folder...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules deleted
) else (
    echo node_modules not found, skipping...
)

echo.
echo Step 3: Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo package-lock.json deleted
) else (
    echo package-lock.json not found, skipping...
)

echo.
echo Step 4: Removing .next folder...
if exist .next (
    rmdir /s /q .next
    echo .next deleted
) else (
    echo .next not found, skipping...
)

echo.
echo Step 5: Installing fresh dependencies...
echo This may take a few minutes...
call npm install

echo.
echo ========================================
echo Clean reinstall complete!
echo ========================================
echo.
echo Now run: npm run dev
echo.
pause
