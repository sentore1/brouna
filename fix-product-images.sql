-- Fix product images with valid placeholder URLs
UPDATE products 
SET image = 'https://via.placeholder.com/400x400/000000/FFFFFF?text=' || name
WHERE image LIKE '/placeholder%' OR image = '';
