const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file manually
const envPath = path.join(__dirname, '.env.local')
let supabaseUrl, supabaseAnonKey

try {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1]
    }
  })
} catch (error) {
  console.log('Could not read .env.local file')
}

console.log('🔍 Direct Products Table Test')
console.log('=============================')
console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testProducts() {
  try {
    console.log('\n1. Testing direct products table access...')
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (error) {
      console.log('❌ Error accessing products table:', error.message)
      console.log('Error code:', error.code)
      
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('\n🔧 SOLUTION: The products table does not exist!')
        console.log('You need to create it in your Supabase SQL Editor.')
        console.log('\nGo to your Supabase dashboard > SQL Editor and run:')
        console.log(`
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  images TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);

-- Insert sample data
INSERT INTO products (name, price, image, category, description, stock) VALUES
('Essential White Tee', 25.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'tops', 'Minimalist white cotton t-shirt', 50),
('Black Minimal Dress', 89.99, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', 'dresses', 'Elegant black dress for any occasion', 30),
('Classic Denim', 69.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'bottoms', 'High-quality denim jeans', 40);
        `)
      }
      return
    }

    console.log(`✅ Products table exists with ${products.length} products`)
    
    if (products.length > 0) {
      console.log('\n📦 Sample products:')
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`)
      })
    } else {
      console.log('⚠️  Products table is empty - add products via admin panel')
    }

  } catch (error) {
    console.log('❌ Connection failed:', error.message)
  }
}

testProducts()