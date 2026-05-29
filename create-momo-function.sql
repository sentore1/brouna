-- Create function to insert momo orders (bypasses schema cache)
CREATE OR REPLACE FUNCTION insert_momo_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_total_amount NUMERIC,
  p_status TEXT,
  p_transaction_id TEXT,
  p_payment_method TEXT,
  p_order_items TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_result JSON;
BEGIN
  -- Ensure table exists
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

  -- Insert the order
  INSERT INTO momo_orders (
    customer_name,
    customer_email,
    customer_phone,
    total_amount,
    status,
    transaction_id,
    payment_method,
    order_items
  ) VALUES (
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_total_amount,
    p_status,
    p_transaction_id,
    p_payment_method,
    p_order_items
  )
  RETURNING id INTO v_order_id;

  -- Return result as JSON
  SELECT json_build_object(
    'id', v_order_id,
    'customer_name', p_customer_name,
    'customer_email', p_customer_email,
    'status', p_status,
    'transaction_id', p_transaction_id
  ) INTO v_result;

  RETURN v_result;
END;
$$;
