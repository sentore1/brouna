-- Check what columns exist in site_settings
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings'
ORDER BY ordinal_position;
