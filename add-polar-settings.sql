-- Add Polar payment settings to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS payment_polar_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS polar_product_id TEXT DEFAULT '';

-- Add polar_order_id to orders table for tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS polar_order_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_polar_order_id ON orders(polar_order_id);

-- Update existing settings (optional - set to true if you want to enable by default)
-- UPDATE site_settings SET payment_polar_enabled = TRUE WHERE id = 1;
