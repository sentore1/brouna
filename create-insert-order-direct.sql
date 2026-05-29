-- Create a function to insert orders directly (bypasses schema cache)
CREATE OR REPLACE FUNCTION insert_order_direct(
  p_user_id UUID,
  p_customer_email VARCHAR,
  p_customer_name VARCHAR,
  p_customer_phone VARCHAR,
  p_total_amount NUMERIC,
  p_status VARCHAR,
  p_transaction_id VARCHAR,
  p_payment_method VARCHAR,
  p_items JSONB,
  p_shipping_address TEXT,
  p_shipping_city TEXT,
  p_shipping_country TEXT,
  p_shipping_postal_code TEXT
)
RETURNS TABLE(
  id UUID,
  customer_email VARCHAR,
  customer_name VARCHAR,
  customer_phone VARCHAR,
  total_amount NUMERIC,
  status VARCHAR,
  payment_transaction_id VARCHAR,
  payment_account VARCHAR,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  INSERT INTO orders (
    user_id,
    customer_email,
    customer_name,
    customer_phone,
    total_amount,
    status,
    payment_transaction_id,
    payment_reference,
    payment_account,
    shipping_address,
    shipping_city,
    shipping_country,
    shipping_postal_code,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_customer_email,
    p_customer_name,
    p_total_amount,
    p_status,
    p_transaction_id,
    p_transaction_id,
    p_payment_method,
    p_shipping_address,
    p_shipping_city,
    p_shipping_country,
    p_shipping_postal_code,
    NOW(),
    NOW()
  )
  RETURNING 
    orders.id,
    orders.customer_email,
    orders.customer_name,
    orders.customer_phone,
    orders.total_amount,
    orders.status,
    orders.payment_transaction_id,
    orders.payment_account,
    orders.created_at
  INTO 
    v_order_id,
    customer_email,
    customer_name,
    customer_phone,
    total_amount,
    status,
    payment_transaction_id,
    payment_account,
    created_at;

  RETURN QUERY SELECT 
    v_order_id,
    customer_email,
    customer_name,
    customer_phone,
    total_amount,
    status,
    payment_transaction_id,
    payment_account,
    created_at;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION insert_order_direct TO service_role;
GRANT EXECUTE ON FUNCTION insert_order_direct TO anon;
GRANT EXECUTE ON FUNCTION insert_order_direct TO authenticated;
