-- Add missing columns to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_hero BOOLEAN DEFAULT false;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_border_radius INTEGER DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_overlay_enabled BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_overlay_color VARCHAR(7) DEFAULT '#000000';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_height INTEGER DEFAULT 400;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS product_grid_columns INTEGER DEFAULT 4;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS product_card_style VARCHAR(20) DEFAULT 'minimal';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS price_badge_color VARCHAR(7) DEFAULT '#3b82f6';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_text_size INTEGER DEFAULT 14;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_logo_size INTEGER DEFAULT 32;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_show_border BOOLEAN DEFAULT false;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_show_logo BOOLEAN DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_title_size INTEGER DEFAULT 24;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_title_weight INTEGER DEFAULT 600;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_title_font VARCHAR(50) DEFAULT 'inherit';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_symbol VARCHAR(5) DEFAULT '™';

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.3;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_button_text VARCHAR(100) DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_button_link VARCHAR(255) DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_font VARCHAR(50) DEFAULT 'inherit';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_size INTEGER DEFAULT 48;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS product_zoom_type VARCHAR(20) DEFAULT 'simple';
