-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default categories
INSERT INTO categories (name) VALUES 
  ('tops'),
  ('bottoms'),
  ('dresses'),
  ('accessories')
ON CONFLICT (name) DO NOTHING;
