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

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAllImages() {
  console.log('🔍 Checking all product images...')
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('❌ Error:', error.message)
      return
    }

    console.log(`\nFound ${products.length} products:\n`)
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Image: ${product.image}`)
      console.log(`   Category: ${product.category}`)
      console.log(`   Price: $${product.price}`)
      console.log('')
    })

    // Update all products with working image URLs
    console.log('🔧 Updating all images with working URLs...')
    
    const imageUpdates = [
      { name: 'Acme Baby Onesie', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop' },
      { name: 'Acme Cup', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop' },
      { name: 'Acme Mug', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
      { name: 'Acme Hoodie', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop' },
      { name: 'Acme Circles T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { name: 'Acme Drawstring Bag', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
      { name: 'Essential Piece 1', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { name: 'Essential Piece 2', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
      { name: 'Essential Piece 3', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop' }
    ]

    for (const update of imageUpdates) {
      const { error } = await supabase
        .from('products')
        .update({ image: update.image })
        .eq('name', update.name)
      
      if (!error) {
        console.log(`✅ Updated ${update.name}`)
      }
    }

    console.log('\n✅ All images updated!')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

checkAllImages()