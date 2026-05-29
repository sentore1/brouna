-- Create hero_sections table for multiple hero sections
CREATE TABLE IF NOT EXISTS hero_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position INTEGER NOT NULL DEFAULT 0,
  vertical_position VARCHAR(20) DEFAULT 'top',
  enabled BOOLEAN DEFAULT true,
  hero_type VARCHAR(20) DEFAULT 'image',
  hero_content TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_height INTEGER DEFAULT 400,
  hero_border_radius INTEGER DEFAULT 0,
  hero_overlay_enabled BOOLEAN DEFAULT true,
  hero_overlay_color VARCHAR(20) DEFAULT '#000000',
  hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.3,
  hero_button_text VARCHAR(100),
  hero_button_link TEXT,
  hero_title_font VARCHAR(100) DEFAULT 'inherit',
  hero_title_size INTEGER DEFAULT 48,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default hero section
INSERT INTO hero_sections (position, vertical_position, enabled, hero_type, hero_content, hero_title, hero_subtitle)
VALUES (0, 'top', true, 'image', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop', 'SIZA', 'Discover timeless pieces crafted for the modern minimalist');
