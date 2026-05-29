-- Add product card height to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS product_card_height VARCHAR(50) DEFAULT 'square';

-- Update existing row with default value
UPDATE site_settings 
SET product_card_height = 'square'
WHERE product_card_height IS NULL;
