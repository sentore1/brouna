-- Add vertical_position column to hero_sections table
ALTER TABLE hero_sections 
ADD COLUMN IF NOT EXISTS vertical_position VARCHAR(20) DEFAULT 'top';

-- Update existing records to have vertical_position set to 'top'
UPDATE hero_sections 
SET vertical_position = 'top' 
WHERE vertical_position IS NULL;
