ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS homepage_product_limit INTEGER DEFAULT 8;
