@echo off
REM Test order creation API
REM Run this after starting your dev server (npm run dev)

echo Testing order creation API...
echo.

curl -X POST http://localhost:3000/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"customerName\":\"Test User\",\"customerEmail\":\"test@example.com\",\"customerPhone\":\"0783300000\",\"total\":100.00,\"transactionId\":\"TEST123456\",\"paymentMethod\":\"MoMo\",\"status\":\"pending\",\"items\":[{\"id\":\"test-1\",\"name\":\"Test Product\",\"price\":100,\"quantity\":1}],\"shippingAddress\":\"Test Address\",\"shippingCity\":\"Kigali\",\"shippingCountry\":\"Rwanda\",\"shippingPostalCode\":\"00000\"}"

echo.
echo.
echo Check the response above. You should see: "success":true
echo If you see an error, check the server logs in your terminal.
pause
