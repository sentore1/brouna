-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin full access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON site_settings;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Allow public read access to site_settings"
ON site_settings FOR SELECT
TO public
USING (true);

-- Allow service role to do everything (for API)
CREATE POLICY "Allow service role full access to site_settings"
ON site_settings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated admin to update
CREATE POLICY "Allow admin to update site_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (auth.email() = 'sizafurniture@gmail.com')
WITH CHECK (auth.email() = 'sizafurniture@gmail.com');
