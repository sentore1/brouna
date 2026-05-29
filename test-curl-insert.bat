@echo off
echo Testing direct database insert via SQL...
echo.

curl -X POST "https://poozdevglimtoiakkndz.supabase.co/rest/v1/rpc/exec_sql" ^
  -H "Content-Type: application/json" ^
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3pkZXZnbGltdG9pYWtrbmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjQzODQsImV4cCI6MjA4MjYwMDM4NH0.Po1_2xiSRRMsLqR0T8Q0QdQMVyAMUXL1bbrWmQ7zz84" ^
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3pkZXZnbGltdG9pYWtrbmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzAyNDM4NCwiZXhwIjoyMDgyNjAwMzg0fQ.89G7-q3DEDFBzf11dax8m4ysEhGS1cEA_A3ogVYkNoY" ^
  -d "{\"sql_query\": \"INSERT INTO orders (customer_email, customer_name, customer_phone, total_amount, status, payment_transaction_id, payment_reference, payment_account, shipping_country, created_at, updated_at) VALUES ('test@curl.com', 'Curl Test', '123456', 500.00, 'pending', 'CURL_TEST_123', 'CURL_TEST_123', 'MoMo', 'Rwanda', NOW(), NOW()) RETURNING id, customer_name, customer_email, total_amount, payment_transaction_id, status;\"}"

echo.
echo.
echo Check the response above.
echo If successful, the order should appear in admin dashboard.
echo.
pause
