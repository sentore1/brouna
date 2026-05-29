-- Create function to insert orders
CREATE OR REPLACE FUNCTION insert_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_total_amount NUMERIC,
  p_status TEXT,
  p_payment_transaction_id TEXT
)
RETURNS TABLE(
  id UUID,
  customer_name VARCHAR,
  customer_email VARCHAR,
  customer_phone VARCHAR,
  total_amount NUMERIC,
  status VARCHAR,
  payment_transaction_id VARCHAR,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, status, payment_transaction_id)
  VALUES (p_customer_name, p_customer_email, p_customer_phone, p_total_amount, p_status, p_payment_transaction_id)
  RETURNING orders.id, orders.customer_name, orders.customer_email, orders.customer_phone, orders.total_amount, orders.status, orders.payment_transaction_id, orders.created_at;
END;
$$;
