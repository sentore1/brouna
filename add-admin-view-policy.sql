-- Add admin view policy (drop first if exists)
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

-- Allow ALL authenticated users to view orders (not just specific email)
CREATE POLICY "Admin can view all orders"
ON orders
FOR SELECT
TO authenticated
USING (true);

-- Also allow admin to update
DROP POLICY IF EXISTS "Admin can update orders" ON orders;

CREATE POLICY "Admin can update orders"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Check what policies exist now
SELECT policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'orders';
