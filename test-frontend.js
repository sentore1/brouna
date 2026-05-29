// Frontend Test Script - Run in browser console on http://localhost:3000
// This script tests the frontend product fetching functionality

console.log('🧪 Testing Frontend Product Loading...')

async function testFrontend() {
  try {
    console.log('\n1. Testing API fetch from frontend...')
    
    const response = await fetch('/api/products')
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ API request failed:', response.status)
      return
    }
    
    const products = await response.json()
    console.log(`✅ API returned ${products.length} products`)
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Check if:')
      console.log('   - Products are added in admin panel')
      console.log('   - Database connection is working')
      console.log('   - RLS policies allow read access')
      return
    }
    
    console.log('\n2. Products data:')
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`)
      console.log(`      Price: ${product.currency === 'USD' ? '$' : ''}${product.price}${product.currency === 'RWF' ? ' RWF' : ''}`)
      console.log(`      Category: ${product.category}`)
      console.log(`      Image: ${product.image}`)
      console.log(`      Stock: ${product.stock || 0}`)
      console.log('')
    })
    
    console.log('\n3. Testing product filtering...')
    const filteredProducts = products.filter(product => 
      product.category === 'tops'
    )
    console.log(`✅ Found ${filteredProducts.length} products in 'tops' category`)
    
    console.log('\n4. Checking DOM elements...')
    const productGrid = document.querySelector('.grid')
    if (productGrid) {
      const productCards = productGrid.children.length
      console.log(`✅ Found ${productCards} product cards in DOM`)
      
      if (productCards !== products.length) {
        console.log('⚠️  Mismatch between API data and DOM elements')
        console.log('   This might indicate a rendering issue')
      }
    } else {
      console.log('❌ Product grid not found in DOM')
    }
    
    console.log('\n5. Testing search functionality...')
    const searchInput = document.querySelector('input[placeholder*="Search"]')
    if (searchInput) {
      console.log('✅ Search input found')
      // Simulate search
      searchInput.value = 'test'
      searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      console.log('✅ Search simulation completed')
    } else {
      console.log('❌ Search input not found')
    }
    
  } catch (error) {
    console.error('❌ Frontend test failed:', error)
  }
}

// Auto-run the test
testFrontend()

// Also provide manual test functions
window.testFrontend = testFrontend
window.checkProducts = async () => {
  const response = await fetch('/api/products')
  const products = await response.json()
  console.table(products)
  return products
}

console.log('\n📝 Manual test functions available:')
console.log('   testFrontend() - Run full frontend test')
console.log('   checkProducts() - Quick product check')