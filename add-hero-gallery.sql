-- Add gallery images support to hero_sections table
ALTER TABLE hero_sections 
ADD COLUMN IF NOT EXISTS hero_gallery_images TEXT DEFAULT '[]';

-- Update existing records
UPDATE hero_sections 
SET hero_gallery_images = '[]' 
WHERE hero_gallery_images IS NULL;
