-- Direct insert test order to verify database works
-- This bypasses all API and schema cache issues

INSERT INTO orders (
  customer_email,
  customer_name,
  customer_phone,
  total_amount,
  status,
  payment_transaction_id,
  payment_reference,
  payment_account,
  shipping_country,
  created_at,
  updated_at
) VALUES (
  'test@example.com',
  'Test Customer',
  '0783300000',
  100.00,
  'pending',
  'TEST_DIRECT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'TEST_DIRECT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'MoMo',
  'Rwanda',
  NOW(),
  NOW()
) RETURNING *;

-- Check if it was inserted
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
