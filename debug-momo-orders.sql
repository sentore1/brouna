-- Check if momo_orders table exists
SELECT table_name FROM information_schema.tables WHERE table_name = 'momo_orders';

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'momo_orders';

-- Check all policies on momo_orders
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'momo_orders';

-- Try to insert a test record directly
INSERT INTO momo_orders (customer_name, customer_email, customer_phone, total_amount, status, transaction_id, payment_method, order_items)
VALUES ('Test Customer', 'test@test.com', '0783300000', 100.00, 'pending', 'TEST123', 'MoMo', '[]')
RETURNING *;

-- If insert fails, check if service role can insert
SET ROLE service_role;
INSERT INTO momo_orders (customer_name, customer_email, customer_phone, total_amount, status, transaction_id, payment_method, order_items)
VALUES ('Test Customer 2', 'test2@test.com', '0783300000', 100.00, 'pending', 'TEST456', 'MoMo', '[]')
RETURNING *;
RESET ROLE;
