-- Simple products table setup
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT,
  stock INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test products
INSERT INTO products (name, price, description, category, image, stock) VALUES
('Acme Circles T-Shirt', 20.00, 'Stylish circles design t-shirt', 'tops', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=T-Shirt', 10),
('Acme Drawstring Bag', 12.00, 'Practical drawstring bag', 'accessories', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Bag', 15),
('Acme Cup', 15.00, 'Premium coffee cup', 'accessories', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Cup', 20),
('Acme Mug', 15.00, 'Classic coffee mug', 'accessories', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Mug', 25),
('Acme Hoodie', 50.00, 'Comfortable hoodie', 'tops', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Hoodie', 8),
('Acme Baby Onesie', 10.00, 'Cute baby onesie', 'accessories', 'https://via.placeholder.com/400x400/000000/FFFFFF?text=Onesie', 12);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);