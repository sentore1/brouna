-- Add reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  rating INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add reviews_enabled toggle to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS reviews_enabled BOOLEAN DEFAULT false;

NOTIFY pgrst, 'reload schema';
