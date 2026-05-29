-- Add momo_dial_code column to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS momo_dial_code TEXT DEFAULT '*180*8*1*{number}*{amount}#';
