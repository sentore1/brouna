// Debug script to check gallery images in products
const { createClient } = require('@supabase/supabase-js')

// You'll need to add your Supabase credentials here
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugGallery() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.error('Error fetching products:', error)
      return
    }

    console.log('=== GALLERY DEBUG REPORT ===\n')
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Main Image: ${product.image}`)
      console.log(`   Images Field: ${product.images}`)
      
      if (product.images) {
        try {
          const parsedImages = JSON.parse(product.images)
          console.log(`   Parsed Images: ${JSON.stringify(parsedImages)}`)
          console.log(`   Valid Images: ${parsedImages.filter(img => img && img.trim() !== '').length}`)
        } catch (e) {
          console.log(`   Parse Error: ${e.message}`)
        }
      } else {
        console.log('   No gallery images')
      }
      console.log('   ---')
    })
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

// Run the debug
debugGallery()