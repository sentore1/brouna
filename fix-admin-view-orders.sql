-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'orders';

-- Drop and recreate admin view policy
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  auth.email() = 'sizafurniture@gmail.com' 
  OR auth.email() = 'sizafurniteure@gmail.com'
  OR auth.email() = 'sizafu43rniture@gmail.com'
  OR auth.email() = 'sizarwfurniture@gmail.com'
);

-- Also allow service role to view all
DROP POLICY IF EXISTS "Service role can view orders" ON orders;

CREATE POLICY "Service role can view orders"
ON orders FOR SELECT
TO service_role
USING (true);
