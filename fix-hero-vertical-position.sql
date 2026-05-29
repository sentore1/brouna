-- Update existing hero sections to have vertical_position
UPDATE hero_sections 
SET vertical_position = 'top' 
WHERE vertical_position IS NULL;
