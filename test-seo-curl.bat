@echo off
echo Testing SIZA SEO API
echo.

echo 1. Testing Sitemap...
curl -s http://localhost:3000/sitemap.xml
echo.
echo.

echo 2. Testing Robots.txt...
curl -s http://localhost:3000/robots.txt
echo.
echo.

echo 3. Testing Homepage Meta Tags...
curl -s http://localhost:3000 | findstr /i "meta title"
echo.
echo.

echo Done!
pause
