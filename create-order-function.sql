-- Create function to insert orders (bypasses schema cache)
CREATE OR REPLACE FUNCTION create_order(
  p_customer_email VARCHAR,
  p_customer_name VARCHAR,
  p_customer_phone VARCHAR,
  p_total_amount NUMERIC,
  p_status VARCHAR,
  p_payment_reference VARCHAR,
  p_payment_transaction_id VARCHAR,
  p_payment_account VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  INSERT INTO orders (
    customer_email,
    customer_name,
    customer_phone,
    total_amount,
    status,
    payment_reference,
    payment_transaction_id,
    payment_account,
    created_at,
    updated_at
  ) VALUES (
    p_customer_email,
    p_customer_name,
    p_customer_phone,
    p_total_amount,
    p_status,
    p_payment_reference,
    p_payment_transaction_id,
    p_payment_account,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_order TO service_role;
GRANT EXECUTE ON FUNCTION create_order TO anon;
GRANT EXECUTE ON FUNCTION create_order TO authenticated;
