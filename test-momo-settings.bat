@echo off
echo Testing MoMo Settings Save...
echo.

curl -X POST http://localhost:3000/api/save-settings ^
  -H "Content-Type: application/json" ^
  -d "{\"site_name\":\"SIZA\",\"site_logo\":\"\",\"homepage_product_limit\":8,\"payment_paypal_enabled\":true,\"payment_kpay_enabled\":true,\"payment_momo_enabled\":true,\"momo_number\":\"0783300000\",\"momo_name\":\"SIZA FURNITURE\",\"momo_instructions\":\"Scan the QR code or tap to dial\",\"momo_dial_code\":\"*182*8*1*{number}*{amount}#\"}"

echo.
echo.
echo Test complete!
pause
