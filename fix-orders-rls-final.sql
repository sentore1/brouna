-- Fix RLS policies for orders table so admin can view all orders

-- Drop all existing policies
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Service role can view orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;
DROP POLICY IF EXISTS "Anon can insert orders" ON orders;
DROP POLICY IF EXISTS "Authenticated can insert orders" ON orders;

-- Allow service role full access
CREATE POLICY "Service role full access"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anon to insert orders
CREATE POLICY "Anon can insert orders"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert orders
CREATE POLICY "Authenticated can insert orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admin to view ALL orders (no email restriction)
CREATE POLICY "Admin can view all orders"
ON orders
FOR SELECT
TO authenticated
USING (true);

-- Allow admin to update orders
CREATE POLICY "Admin can update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'orders';
