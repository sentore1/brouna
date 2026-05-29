-- Add product page layout and button settings to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS product_page_layout VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS add_to_cart_button_text VARCHAR(100) DEFAULT 'Add to Cart';

-- Update existing row with default values
UPDATE site_settings 
SET product_page_layout = 'default',
    add_to_cart_button_text = 'Add to Cart'
WHERE product_page_layout IS NULL;
