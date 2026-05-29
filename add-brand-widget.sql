-- Add brand widget fields to hero_sections table
ALTER TABLE hero_sections
  ADD COLUMN IF NOT EXISTS brand_bg_text TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_bg_text_size INTEGER DEFAULT 160,
  ADD COLUMN IF NOT EXISTS brand_bg_text_color VARCHAR(20) DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS brand_bg_text_opacity DECIMAL(3,2) DEFAULT 0.08,
  ADD COLUMN IF NOT EXISTS brand_image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_overlay_text TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_overlay_subtext TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_overlay_bg VARCHAR(20) DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS brand_overlay_opacity DECIMAL(3,2) DEFAULT 0.85,
  ADD COLUMN IF NOT EXISTS brand_btn1_text VARCHAR(100) DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_btn1_link VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_btn2_text VARCHAR(100) DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_btn2_link VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_badge_text VARCHAR(100) DEFAULT '',
  ADD COLUMN IF NOT EXISTS brand_image_position VARCHAR(20) DEFAULT 'center';
