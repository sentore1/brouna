-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  shipping_postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow service role to insert orders (for API)
CREATE POLICY "Service role can insert orders"
ON orders FOR INSERT
TO service_role
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
