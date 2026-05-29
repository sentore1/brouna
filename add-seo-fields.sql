-- Add SEO fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS meta_tags TEXT;

-- Update existing products with SEO data for high-end clothing
UPDATE products SET 
  seo_title = name || ' - Luxury Fashion | SIZA',
  seo_description = 'Shop ' || name || ' at SIZA. Premium quality ' || category || ' crafted for discerning fashion enthusiasts. Free shipping on luxury fashion.',
  seo_keywords = 'luxury ' || category || ', high-end fashion, designer ' || category || ', premium clothing, ' || name || ', SIZA fashion, luxury apparel, designer wear'
WHERE seo_title IS NULL;
