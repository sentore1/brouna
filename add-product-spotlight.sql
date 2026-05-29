-- Add product spotlight widget fields to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS spotlight_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS spotlight_image TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS spotlight_title TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS spotlight_subtitle TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS spotlight_price TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS spotlight_price_prefix TEXT DEFAULT 'From',
  ADD COLUMN IF NOT EXISTS spotlight_link TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS spotlight_width INTEGER DEFAULT 320,
  ADD COLUMN IF NOT EXISTS spotlight_bg_color VARCHAR(20) DEFAULT '#f5f5f5';

NOTIFY pgrst, 'reload schema';
