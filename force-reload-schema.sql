-- Force reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Wait a moment then verify
SELECT pg_sleep(2);

-- Test if columns are visible
SELECT column_name FROM information_schema.columns WHERE table_name = 'orders';
