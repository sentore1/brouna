@echo off
echo Testing SIZA API Endpoints...
echo.

echo 1. Testing GET /api/products (should return all products)
curl -X GET http://localhost:3000/api/products -H "Content-Type: application/json"
echo.
echo.

echo 2. Testing POST /api/products (adding a test product)
curl -X POST http://localhost:3000/api/products ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Product\",\"price\":29.99,\"description\":\"Test product from curl\",\"category\":\"tops\",\"image\":\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500\",\"stock\":10,\"currency\":\"USD\"}"
echo.
echo.

echo 3. Testing GET /api/products again (should include the new product)
curl -X GET http://localhost:3000/api/products -H "Content-Type: application/json"
echo.
echo.

echo 4. Testing admin page accessibility
curl -I http://localhost:3000/admin
echo.

echo Tests completed!
pause