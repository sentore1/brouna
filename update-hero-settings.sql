-- Add hero customization columns to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_hero BOOLEAN DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_border_radius INTEGER DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_overlay_enabled BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_overlay_color VARCHAR(7) DEFAULT '#000000';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_height INTEGER DEFAULT 400;