-- Create a function to update site settings that bypasses PostgREST cache
CREATE OR REPLACE FUNCTION update_site_settings(settings_json jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  settings_id uuid;
BEGIN
  -- Get the settings ID
  SELECT id INTO settings_id FROM site_settings LIMIT 1;
  
  IF settings_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No settings row found');
  END IF;
  
  -- Update using dynamic SQL to bypass cache
  UPDATE site_settings
  SET
    site_name = COALESCE((settings_json->>'site_name')::text, site_name),
    site_logo = COALESCE((settings_json->>'site_logo')::text, site_logo),
    homepage_product_limit = COALESCE((settings_json->>'homepage_product_limit')::int, homepage_product_limit),
    payment_paypal_enabled = COALESCE((settings_json->>'payment_paypal_enabled')::boolean, payment_paypal_enabled),
    payment_kpay_enabled = COALESCE((settings_json->>'payment_kpay_enabled')::boolean, payment_kpay_enabled),
    payment_momo_enabled = COALESCE((settings_json->>'payment_momo_enabled')::boolean, payment_momo_enabled),
    momo_number = COALESCE((settings_json->>'momo_number')::text, momo_number),
    momo_name = COALESCE((settings_json->>'momo_name')::text, momo_name),
    momo_instructions = COALESCE((settings_json->>'momo_instructions')::text, momo_instructions),
    momo_dial_code = COALESCE((settings_json->>'momo_dial_code')::text, momo_dial_code)
  WHERE id = settings_id;
  
  RETURN jsonb_build_object('success', true, 'id', settings_id);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_site_settings(jsonb) TO anon, authenticated, service_role;
