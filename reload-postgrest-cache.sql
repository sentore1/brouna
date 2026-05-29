-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Also try reloading config
NOTIFY pgrst, 'reload config';

-- Verify the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name = 'momo_dial_code';
