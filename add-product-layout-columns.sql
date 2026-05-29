-- Add product layout columns to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS product_grid_columns INTEGER DEFAULT 4;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS product_card_style VARCHAR(20) DEFAULT 'minimal';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS price_badge_color VARCHAR(7) DEFAULT '#3b82f6';