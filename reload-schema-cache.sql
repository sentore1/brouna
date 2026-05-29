-- Step 1: Check what columns exist in site_settings
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'site_settings'
ORDER BY ordinal_position;

-- Step 2: Check specifically for momo columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'site_settings' 
AND column_name LIKE '%momo%';

-- Step 3: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Step 4: Verify the columns are there
SELECT 
  payment_paypal_enabled,
  payment_kpay_enabled,
  payment_momo_enabled,
  momo_number,
  momo_name,
  momo_instructions,
  momo_dial_code
FROM site_settings
LIMIT 1;
