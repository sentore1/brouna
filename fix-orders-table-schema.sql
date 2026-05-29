-- Fix orders table schema to match API expectations
-- This adds missing columns and ensures compatibility

-- Add missing columns if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account TEXT;

-- Migrate data from old columns to new columns if needed
UPDATE orders 
SET total_amount = total 
WHERE total_amount IS NULL AND total IS NOT NULL;

UPDATE orders 
SET payment_transaction_id = transaction_id 
WHERE payment_transaction_id IS NULL AND transaction_id IS NOT NULL;

UPDATE orders 
SET payment_account = payment_method 
WHERE payment_account IS NULL AND payment_method IS NOT NULL;

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on order_items
DROP POLICY IF EXISTS "Admin can view order_items" ON order_items;
DROP POLICY IF EXISTS "Service role can insert order_items" ON order_items;

-- Allow service role to insert order items
CREATE POLICY "Service role can insert order_items"
ON order_items FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow admin to view order items
CREATE POLICY "Admin can view order_items"
ON order_items FOR SELECT
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com');

-- Update RLS policies for orders table
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Allow service role to insert orders
CREATE POLICY "Service role can insert orders"
ON orders FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow anon to insert orders (for checkout without login)
CREATE POLICY "Anon can insert orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Allow admin to view all orders
CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com');

-- Allow admin to update orders
CREATE POLICY "Admin can update orders"
ON orders FOR UPDATE
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com')
WITH CHECK (auth.email() = 'sizafurniture@gmail.com');

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
