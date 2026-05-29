-- Reload schema
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Verify momo_orders table exists
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'momo_orders';
