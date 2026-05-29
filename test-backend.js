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

console.log('Testing Backend Connection...')
console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testBackend() {
  try {
    console.log('\n1. Testing Supabase connection...')
    
    // Test basic connection
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'products')

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError)
      return
    }

    if (!tables?.length) {
      console.log('❌ Products table does not exist')
      console.log('Run this SQL in Supabase SQL Editor:')
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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
      `)
      return
    }

    console.log('✅ Products table exists')

    console.log('\n2. Testing products query...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
      return
    }

    console.log(`✅ Found ${products?.length || 0} products`)
    if (products?.length) {
      console.log('Products:')
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - ${product.currency === 'USD' ? '$' : ''}${product.price}${product.currency === 'RWF' ? ' RWF' : ''} (${product.category})`)
      })
    } else {
      console.log('No products found. Add some products in admin panel.')
    }

    console.log('\n3. Testing API endpoint...')
    const response = await fetch('http://localhost:3000/api/products')
    if (response.ok) {
      const apiProducts = await response.json()
      console.log(`✅ API returned ${apiProducts.length} products`)
    } else {
      console.log(`❌ API request failed with status: ${response.status}`)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testBackend()