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

async function fixImages() {
  console.log('🔧 Fixing product images...')
  
  try {
    // Update products with placeholder images to use real images
    const updates = [
      {
        name: 'Essential Piece 1',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
      },
      {
        name: 'Essential Piece 2', 
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
      },
      {
        name: 'Essential Piece 3',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
      }
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('products')
        .update({ image: update.image })
        .eq('name', update.name)
      
      if (error) {
        console.log(`❌ Failed to update ${update.name}:`, error.message)
      } else {
        console.log(`✅ Updated ${update.name}`)
      }
    }

    console.log('\n✅ Image fix completed!')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

fixImages()