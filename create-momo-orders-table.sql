-- Create new table for MoMo orders
CREATE TABLE IF NOT EXISTS momo_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC,
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_method TEXT,
  order_items TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE momo_orders ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert
CREATE POLICY "Service role can insert momo_orders"
ON momo_orders FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow admin to view all
CREATE POLICY "Admin can view momo_orders"
ON momo_orders FOR SELECT
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com');

-- Reload schema
NOTIFY pgrst, 'reload schema';
