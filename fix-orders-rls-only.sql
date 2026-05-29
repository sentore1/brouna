-- Fix RLS policies for orders table
-- Your table structure is correct, we just need to fix permissions

-- Drop all existing policies on orders
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;
DROP POLICY IF EXISTS "Anon can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for service role" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;

-- Allow service role to do everything (for API calls)
CREATE POLICY "Service role full access"
ON orders
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anonymous users to insert orders (for checkout without login)
CREATE POLICY "Anon can insert orders"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert orders
CREATE POLICY "Authenticated can insert orders"
ON orders FOR INSERT
TO authenticated
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

-- Allow users to view their own orders (if logged in)
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

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
DROP POLICY IF EXISTS "Service role full access order_items" ON order_items;

-- Allow service role full access to order_items
CREATE POLICY "Service role full access order_items"
ON order_items
TO service_role
USING (true)
WITH CHECK (true);

-- Allow admin to view order items
CREATE POLICY "Admin can view order_items"
ON order_items FOR SELECT
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com');

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
