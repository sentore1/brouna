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

console.log('🔍 SIZA Troubleshooting Script')
console.log('=================================')

async function troubleshoot() {
  console.log('\n📋 ENVIRONMENT CHECK')
  console.log('--------------------')
  console.log('Supabase URL:', supabaseUrl || '❌ MISSING')
  console.log('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ MISSING')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ CRITICAL: Missing Supabase credentials in .env.local')
    console.log('Make sure your .env.local contains:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('\n🗄️  DATABASE CHECK')
  console.log('------------------')
  
  try {
    // Check if products table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'products')

    if (tablesError) {
      console.log('❌ Error checking database:', tablesError.message)
      return
    }

    if (!tables?.length) {
      console.log('❌ Products table does not exist')
      console.log('\n🔧 SOLUTION: Create the products table in Supabase SQL Editor:')
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
      `)
      return
    }

    console.log('✅ Products table exists')

    // Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'products')
      .eq('table_schema', 'public')

    if (!columnsError && columns) {
      console.log('✅ Table structure:')
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`)
      })
    }

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive')
      .eq('tablename', 'products')

    if (!policiesError && policies) {
      console.log(`✅ Found ${policies.length} RLS policies`)
      if (policies.length === 0) {
        console.log('⚠️  No RLS policies found - this might prevent data access')
      }
    }

    // Check products data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (productsError) {
      console.log('❌ Error fetching products:', productsError.message)
      console.log('This might be due to RLS policies or permissions')
      return
    }

    console.log(`✅ Found ${products?.length || 0} products in database`)
    
    if (products?.length) {
      console.log('\n📦 PRODUCTS DATA')
      console.log('----------------')
      products.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`)
        console.log(`   Price: ${product.currency === 'USD' ? '$' : ''}${product.price}${product.currency === 'RWF' ? ' RWF' : ''}`)
        console.log(`   Category: ${product.category}`)
        console.log(`   Stock: ${product.stock || 0}`)
        console.log(`   Created: ${new Date(product.created_at).toLocaleString()}`)
        console.log('')
      })
      
      if (products.length > 5) {
        console.log(`... and ${products.length - 5} more products`)
      }
    } else {
      console.log('⚠️  No products found in database')
      console.log('Add products through the admin panel at http://localhost:3000/admin')
    }

  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
  }

  console.log('\n🌐 API ENDPOINT CHECK')
  console.log('---------------------')
  
  try {
    const response = await fetch('http://localhost:3000/api/products')
    console.log('API Response Status:', response.status)
    
    if (response.ok) {
      const apiProducts = await response.json()
      console.log(`✅ API returned ${apiProducts.length} products`)
      
      if (apiProducts.length === 0) {
        console.log('⚠️  API returns empty array - check database connection in API route')
      }
    } else {
      console.log('❌ API request failed')
      console.log('Make sure Next.js dev server is running on port 3000')
    }
  } catch (error) {
    console.log('❌ Cannot reach API endpoint:', error.message)
    console.log('Make sure Next.js dev server is running: npm run dev')
  }

  console.log('\n🎯 COMMON ISSUES & SOLUTIONS')
  console.log('-----------------------------')
  console.log('1. Products not showing on frontend:')
  console.log('   - Check if products exist in database')
  console.log('   - Verify RLS policies allow public read access')
  console.log('   - Ensure API endpoint returns data')
  console.log('')
  console.log('2. Admin panel not saving products:')
  console.log('   - Check browser console for errors')
  console.log('   - Verify Supabase credentials')
  console.log('   - Check RLS policies allow insert/update')
  console.log('')
  console.log('3. Different ports (3000 vs 3001):')
  console.log('   - Both should use the same database')
  console.log('   - Check if both use same .env.local file')
  console.log('   - Verify CORS settings if needed')
  console.log('')
  console.log('4. Network/CORS issues:')
  console.log('   - Check browser network tab for failed requests')
  console.log('   - Verify Supabase project is active')
  console.log('   - Check if API keys are correct')
}

troubleshoot().catch(console.error)