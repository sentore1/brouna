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

console.log('🔍 API vs Database Comparison')
console.log('=============================')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function compareApiAndDatabase() {
  try {
    console.log('\n1. Testing direct database access...')
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.log('❌ Database error:', dbError.message)
      return
    }

    console.log(`✅ Database has ${dbProducts.length} products`)
    if (dbProducts.length > 0) {
      console.log('First 3 products from database:')
      dbProducts.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`)
      })
    }

    console.log('\n2. Testing API endpoint...')
    const response = await fetch('http://localhost:3001/api/products')
    console.log('API Response Status:', response.status)
    
    if (response.ok) {
      const apiProducts = await response.json()
      console.log(`API returned ${apiProducts.length} products`)
      
      if (apiProducts.length === 0 && dbProducts.length > 0) {
        console.log('\n❌ PROBLEM FOUND!')
        console.log('Database has products but API returns empty array')
        console.log('\nPossible causes:')
        console.log('1. RLS policies blocking API access')
        console.log('2. Different environment variables in API route')
        console.log('3. API route error not being caught')
        
        console.log('\n🔧 SOLUTIONS:')
        console.log('1. Check RLS policies in Supabase dashboard')
        console.log('2. Add console.log to API route for debugging')
        console.log('3. Check browser network tab for API errors')
      } else if (apiProducts.length > 0) {
        console.log('✅ API is working correctly')
        console.log('First 3 products from API:')
        apiProducts.slice(0, 3).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`)
        })
      }
    } else {
      console.log('❌ API request failed with status:', response.status)
    }

    console.log('\n3. Testing RLS policies...')
    // Try to insert a test record to check permissions
    const testProduct = {
      name: 'Test Product',
      price: 1.00,
      image: 'https://via.placeholder.com/300',
      category: 'test',
      description: 'Test product for debugging'
    }

    const { data: insertResult, error: insertError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()

    if (insertError) {
      console.log('❌ Cannot insert test product:', insertError.message)
      console.log('This suggests RLS policies are blocking write access')
    } else {
      console.log('✅ Can insert products (will clean up)')
      // Clean up test product
      await supabase.from('products').delete().eq('id', insertResult[0].id)
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

compareApiAndDatabase()