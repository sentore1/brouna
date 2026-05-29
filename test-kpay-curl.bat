@echo off
echo Testing KPay API with CURL
echo.

echo Test 1: Mobile Money Payment (MTN)
echo ===================================
curl -X POST https://pay.esicia.com ^
  -u pryo:6Laa5w ^
  -H "Content-Type: application/json" ^
  -d "{\"msisdn\":\"250783300000\",\"email\":\"test@SIZA.com\",\"details\":\"Test Order\",\"refid\":\"CURL_TEST_%RANDOM%\",\"amount\":70000,\"currency\":\"RWF\",\"cname\":\"Test Customer\",\"cnumber\":\"250783300000\",\"pmethod\":\"momo\",\"retailerid\":\"01\",\"returl\":\"http://localhost:3000/api/kpay/webhook\",\"redirecturl\":\"http://localhost:3000/order-success\",\"bankid\":\"63510\",\"action\":\"pay\"}"

echo.
echo.
echo Test 2: Card Payment
echo ===================================
curl -X POST https://pay.esicia.com ^
  -u pryo:6Laa5w ^
  -H "Content-Type: application/json" ^
  -d "{\"msisdn\":\"250783300000\",\"email\":\"test@SIZA.com\",\"details\":\"Test Card Order\",\"refid\":\"CURL_CARD_%RANDOM%\",\"amount\":70000,\"currency\":\"RWF\",\"cname\":\"Test Customer\",\"cnumber\":\"250783300000\",\"pmethod\":\"cc\",\"retailerid\":\"01\",\"returl\":\"http://localhost:3000/api/kpay/webhook\",\"redirecturl\":\"http://localhost:3000/order-success\",\"bankid\":\"000\",\"action\":\"pay\"}"

echo.
echo.
pause