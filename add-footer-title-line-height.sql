-- Add footer_title_line_height column to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS footer_title_line_height DECIMAL(3,1) DEFAULT 1.2;
