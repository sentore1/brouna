-- Update products table structure
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Update existing products to have required fields
UPDATE products SET 
  description = 'Product description',
  images = JSON_ARRAY(image),
  stock = 10
WHERE description IS NULL OR images IS NULL OR stock IS NULL;