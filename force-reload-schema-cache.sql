-- Force reload schema cache and ensure payment_account column exists
-- Run this script to fix the "column not found in schema cache" error

-- First, ensure the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_account'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_account VARCHAR;
    END IF;
END $$;

-- Reload the PostgREST schema cache (multiple methods to ensure it works)
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Alternative: Use the admin API to reload (if above doesn't work)
-- You may need to manually reload via Supabase Dashboard > API Settings > Reload Schema

-- Verify the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'payment_account';

-- Show message
DO $$ 
BEGIN
    RAISE NOTICE 'Schema cache reload initiated. If the error persists, manually reload schema in Supabase Dashboard > API Settings.';
END $$;
