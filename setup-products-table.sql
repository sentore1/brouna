-- Create products table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, price, image, category, description) VALUES
('Essential Piece 1', 25.00, '/placeholder-product.jpg', 'tops', 'Minimalist essential piece'),
('Essential Piece 2', 25.00, '/placeholder-product.jpg', 'bottoms', 'Timeless wardrobe staple'),
('Essential Piece 3', 25.00, '/placeholder-product.jpg', 'dresses', 'Modern minimalist design');

-- Enable Row Level Security (optional)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
FOR SELECT USING (true);