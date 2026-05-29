-- Fix gallery images for existing products
-- This script will clean up any malformed image arrays

-- First, let's see what we have
SELECT id, name, image, images FROM products WHERE images IS NOT NULL;

-- Update products where images field is empty or contains empty strings
UPDATE products 
SET images = JSON_ARRAY(image)
WHERE images IS NULL OR images = '' OR images = '[]' OR images = '[""]';

-- For products with malformed JSON, reset to use main image
UPDATE products 
SET images = JSON_ARRAY(image)
WHERE images IS NOT NULL 
  AND (
    images NOT LIKE '[%]' 
    OR images = '[""]'
    OR images = '[null]'
    OR images = '[]'
  );

-- Clean up any products where the main image is empty but images array exists
UPDATE products 
SET image = JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]'))
WHERE (image IS NULL OR image = '') 
  AND images IS NOT NULL 
  AND JSON_LENGTH(images) > 0
  AND JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) IS NOT NULL
  AND JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) != '';

-- Verify the fixes
SELECT id, name, image, images FROM products;