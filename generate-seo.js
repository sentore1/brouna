// SEO Content Generator for SIZA Products
// Run: node generate-seo.js

const categoryKeywords = {
  dresses: [
    'luxury dresses', 'designer evening gowns', 'elegant cocktail dress',
    'formal wear', 'silk dresses', 'premium evening wear', 'high-end party dress',
    'sophisticated gowns', 'designer formal dress', 'exclusive evening wear'
  ],
  tops: [
    'luxury blouses', 'designer shirts', 'premium tops', 'silk blouse',
    'cashmere sweater', 'high-end knitwear', 'elegant tops', 'designer casual wear',
    'luxury t-shirts', 'premium fashion tops'
  ],
  bottoms: [
    'designer pants', 'luxury trousers', 'premium jeans', 'high-end skirts',
    'elegant bottoms', 'designer denim', 'luxury wide-leg pants',
    'sophisticated trousers', 'premium culottes', 'designer shorts'
  ],
  accessories: [
    'luxury handbags', 'designer bags', 'premium leather goods',
    'high-end accessories', 'elegant jewelry', 'designer scarves',
    'luxury belts', 'premium sunglasses', 'exclusive accessories', 'designer wallets'
  ]
}

const brandKeywords = [
  'SIZA', 'SIZA fashion', 'SIZA clothing', 'SIZA luxury'
]

const qualityKeywords = [
  'high-end fashion', 'designer wear', 'premium quality', 'luxury materials',
  'sophisticated style', 'timeless pieces', 'exclusive design'
]

function generateSEO(productName, category, price) {
  const catKeywords = categoryKeywords[category.toLowerCase()] || []
  
  // Generate SEO Title
  const seoTitle = `${productName} - Luxury ${category.charAt(0).toUpperCase() + category.slice(1)} | SIZA`
  
  // Generate SEO Description
  const seoDescription = `Shop ${productName} at SIZA. Premium quality ${category} crafted for discerning fashion enthusiasts. Luxury designer wear with sophisticated style. Free shipping on orders over $100.`
  
  // Generate Keywords
  const keywords = [
    ...catKeywords.slice(0, 5),
    productName.toLowerCase(),
    `SIZA ${category}`,
    ...qualityKeywords.slice(0, 3)
  ].join(', ')
  
  return {
    seo_title: seoTitle.substring(0, 60),
    seo_description: seoDescription.substring(0, 160),
    seo_keywords: keywords
  }
}

// Example usage
const exampleProducts = [
  { name: 'Silk Evening Gown', category: 'dresses', price: 299.99 },
  { name: 'Cashmere Turtleneck', category: 'tops', price: 189.99 },
  { name: 'Wide Leg Trousers', category: 'bottoms', price: 149.99 },
  { name: 'Leather Tote Bag', category: 'accessories', price: 249.99 }
]

console.log('=== SIZA SEO Generator ===\n')

exampleProducts.forEach(product => {
  const seo = generateSEO(product.name, product.category, product.price)
  console.log(`Product: ${product.name}`)
  console.log(`Category: ${product.category}`)
  console.log(`\nSEO Title (${seo.seo_title.length} chars):`)
  console.log(seo.seo_title)
  console.log(`\nSEO Description (${seo.seo_description.length} chars):`)
  console.log(seo.seo_description)
  console.log(`\nKeywords:`)
  console.log(seo.seo_keywords)
  console.log('\n' + '='.repeat(60) + '\n')
})

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateSEO, categoryKeywords, brandKeywords, qualityKeywords }
}
