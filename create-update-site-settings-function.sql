-- Create or replace function to update site_settings
CREATE OR REPLACE FUNCTION update_site_settings(settings_json jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  settings_id uuid;
  result jsonb;
BEGIN
  -- Get the settings ID
  SELECT id INTO settings_id FROM site_settings LIMIT 1;
  
  -- If no settings exist, create one
  IF settings_id IS NULL THEN
    INSERT INTO site_settings DEFAULT VALUES RETURNING id INTO settings_id;
  END IF;
  
  -- Update the settings dynamically
  UPDATE site_settings
  SET
    site_name = COALESCE((settings_json->>'site_name')::text, site_name),
    site_logo = COALESCE((settings_json->>'site_logo')::text, site_logo),
    homepage_product_limit = COALESCE((settings_json->>'homepage_product_limit')::integer, homepage_product_limit),
    payment_paypal_enabled = COALESCE((settings_json->>'payment_paypal_enabled')::boolean, payment_paypal_enabled),
    payment_kpay_enabled = COALESCE((settings_json->>'payment_kpay_enabled')::boolean, payment_kpay_enabled),
    payment_momo_enabled = COALESCE((settings_json->>'payment_momo_enabled')::boolean, payment_momo_enabled),
    momo_number = COALESCE((settings_json->>'momo_number')::text, momo_number),
    momo_name = COALESCE((settings_json->>'momo_name')::text, momo_name),
    momo_instructions = COALESCE((settings_json->>'momo_instructions')::text, momo_instructions),
    momo_dial_code = COALESCE((settings_json->>'momo_dial_code')::text, momo_dial_code)
  WHERE id = settings_id;
  
  -- Return success
  result = jsonb_build_object('success', true, 'id', settings_id);
  RETURN result;
END;
$$;
