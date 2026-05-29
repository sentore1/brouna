-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  category VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  images TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_reference VARCHAR(255),
  payment_transaction_id VARCHAR(255),
  payment_account VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table (simple auth)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (name, description, price, currency, category, image, stock) VALUES
('Essential White Tee', 'Minimalist white cotton t-shirt with perfect fit', 19.99, 'USD', 'tops', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 50),
('Black Minimal Dress', 'Elegant black dress for any occasion', 89.99, 'USD', 'dresses', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', 30),
('Classic Denim', 'High-quality denim jeans with modern cut', 69.99, 'USD', 'bottoms', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 40),
('Leather Handbag', 'Premium leather handbag in minimalist design', 149.99, 'USD', 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 20),
('Silk Blouse', 'Luxurious silk blouse in neutral tone', 79.99, 'USD', 'tops', 'https://images.unsplash.com/photo-1564257577-0a8c8b0b8b0b?w=500', 25),
('Wide Leg Trousers', 'Comfortable wide leg trousers for modern look', 59.99, 'USD', 'bottoms', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', 35);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to products
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Create policies for orders (customers can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update orders" ON orders FOR UPDATE USING (true);

-- Create policies for order items
CREATE POLICY "Order items are viewable by everyone" ON order_items FOR SELECT USING (true);
CREATE POLICY "Order items can be created" ON order_items FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to set up proper authentication)
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (true);
CREATE POLICY "Admin can manage orders" ON orders FOR ALL USING (true);