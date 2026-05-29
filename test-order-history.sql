-- Test Order Flow - Run this in Supabase SQL Editor

-- Step 1: Get a test user ID (replace with your actual user ID from auth.users)
-- You can get this by running: SELECT id, email FROM auth.users LIMIT 1;

-- Step 2: Insert a test completed order
INSERT INTO orders (user_id, total, payment_method, transaction_id, items, status)
VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  70000,
  'PayPal',
  'TEST_PAYPAL_12345',
  '[
    {"id": "1", "name": "Essential Tee", "price": 25000, "quantity": 1},
    {"id": "2", "name": "Minimal Dress", "price": 45000, "quantity": 1}
  ]'::jsonb,
  'completed'
);

-- Step 3: Insert a test pending order
INSERT INTO orders (user_id, total, payment_method, transaction_id, items, status)
VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  50000,
  'KPay-momo',
  'A211461767372168',
  '[
    {"id": "3", "name": "Classic Shirt", "price": 50000, "quantity": 1}
  ]'::jsonb,
  'pending'
);

-- Step 4: Verify orders were inserted
SELECT id, total, payment_method, status, created_at 
FROM orders 
WHERE user_id = 'YOUR_USER_ID_HERE'
ORDER BY created_at DESC;
