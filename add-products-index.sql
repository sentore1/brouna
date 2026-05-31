-- Add index on created_at column for faster sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Add index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Add index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
