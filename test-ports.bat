@echo off
echo Testing SIZA on Different Ports
echo ===================================
echo.

echo Testing Port 3000 (Main App)
echo -----------------------------
echo 1. Testing main page accessibility:
curl -I http://localhost:3000 2>nul
if %errorlevel% neq 0 (
    echo ❌ Port 3000 not accessible - make sure to run: npm run dev
) else (
    echo ✅ Port 3000 accessible
)
echo.

echo 2. Testing API endpoint on port 3000:
curl -s http://localhost:3000/api/products 2>nul | find "["
if %errorlevel% neq 0 (
    echo ❌ API not responding on port 3000
) else (
    echo ✅ API responding on port 3000
)
echo.

echo 3. Testing admin page on port 3000:
curl -I http://localhost:3000/admin 2>nul
if %errorlevel% neq 0 (
    echo ❌ Admin page not accessible on port 3000
) else (
    echo ✅ Admin page accessible on port 3000
)
echo.

echo Testing Port 3001 (If Running)
echo --------------------------------
echo 4. Testing if anything runs on port 3001:
curl -I http://localhost:3001 2>nul
if %errorlevel% neq 0 (
    echo ❌ Nothing running on port 3001 (this is normal)
    echo    Your app should run on port 3000 only
) else (
    echo ⚠️  Something is running on port 3001
    echo    This might be causing confusion
)
echo.

echo 5. Testing API on port 3001 (if exists):
curl -s http://localhost:3001/api/products 2>nul | find "["
if %errorlevel% neq 0 (
    echo ❌ No API on port 3001 (this is expected)
) else (
    echo ⚠️  API found on port 3001 - this might be the issue!
)
echo.

echo DIAGNOSIS:
echo -----------
echo Your Next.js app should run on ONE port only (usually 3000)
echo Both the main site and admin panel should be on the same port
echo If you see responses from port 3001, that might be the problem
echo.
echo SOLUTION:
echo ---------
echo 1. Stop all running servers
echo 2. Run only: npm run dev (this starts on port 3000)
echo 3. Access admin at: http://localhost:3000/admin
echo 4. Access main site at: http://localhost:3000
echo.

pause