-- Fix gallery images for PostgreSQL/Supabase
-- Simple fix for gallery display issues

-- Update products where images field is empty or null
UPDATE products 
SET images = '["' || image || '"]'
WHERE images IS NULL OR images = '' OR images = '[]' OR images = '[""]';

-- Verify the fix
SELECT id, name, image, images FROM products;