-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_type TEXT DEFAULT 'image',
  hero_content TEXT DEFAULT '/hero-image.jpg',
  hero_title TEXT DEFAULT 'SIZA',
  hero_subtitle TEXT DEFAULT 'Discover timeless pieces crafted for the modern minimalist',
  header_style TEXT DEFAULT 'minimal',
  footer_style TEXT DEFAULT 'simple',
  site_name TEXT DEFAULT 'SIZA',
  site_logo TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (hero_type, hero_content, hero_title, hero_subtitle, header_style, footer_style, site_name)
VALUES ('image', '/hero-image.jpg', 'SIZA', 'Discover timeless pieces crafted for the modern minimalist', 'minimal', 'simple', 'SIZA')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin write access" ON site_settings FOR ALL USING (true);