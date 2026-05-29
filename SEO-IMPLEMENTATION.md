# SEO Implementation for SIZA

## Overview
Complete SEO system for SIZA luxury clothing brand with dynamic metadata, structured data, and keyword optimization.

## Database Changes

Run the SQL migration:
```bash
psql -d your_database < add-seo-fields.sql
```

This adds to products table:
- `seo_title` - Custom page title
- `seo_description` - Meta description
- `seo_keywords` - Target keywords
- `meta_tags` - Additional meta tags

## Features Implemented

### 1. Dynamic Metadata
- Root layout: Brand-level SEO
- Product pages: Dynamic per-product metadata
- Products listing: Collection-level SEO
- OpenGraph & Twitter Cards for social sharing

### 2. Structured Data (JSON-LD)
- Organization schema for brand
- Product schema with pricing, availability
- Aggregate ratings for products

### 3. Sitemap & Robots
- Auto-generated sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Dynamic product URLs included

### 4. Keywords Strategy
Each product automatically gets keywords:
- Category-specific: "luxury [category]"
- Product-specific: "[product name]"
- Brand terms: "SIZA", "high-end fashion"
- Generic: "designer wear", "premium clothing"

## Adding SEO to New Products

### Via Database:
```sql
INSERT INTO products (name, price, category, image, stock, 
  seo_title, seo_description, seo_keywords) 
VALUES (
  'Silk Evening Gown',
  299.99,
  'dresses',
  'image-url.jpg',
  15,
  'Silk Evening Gown - Luxury Designer Dress | SIZA',
  'Exquisite silk evening gown crafted for elegant occasions. Premium designer dress with sophisticated draping and timeless style.',
  'luxury evening gown, silk dress, designer evening wear, formal dress, elegant gown, SIZA dresses, high-end evening dress'
);
```

### Via API:
```javascript
// Update product SEO
await fetch(`/api/products/${productId}/seo`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seo_title: 'Product Title - Luxury Fashion | SIZA',
    seo_description: 'Detailed description with keywords...',
    seo_keywords: 'keyword1, keyword2, keyword3'
  })
})
```

## SEO Best Practices Applied

1. **Title Tags**: 50-60 characters, brand at end
2. **Meta Descriptions**: 150-160 characters, compelling CTAs
3. **Keywords**: 5-10 relevant terms per product
4. **Image Alt Text**: Descriptive product names
5. **Structured Data**: Rich snippets for search results
6. **Mobile-First**: Responsive design
7. **Page Speed**: Optimized images, minimal JS

## Keyword Categories

### Brand Keywords
- SIZA
- SIZA fashion
- SIZA clothing

### Product Type Keywords
- luxury dresses
- designer tops
- premium bottoms
- elegant accessories
- high-end fashion

### Quality Keywords
- premium quality
- luxury materials
- designer craftsmanship
- exclusive design

### Style Keywords
- minimalist fashion
- sophisticated style
- timeless pieces
- elegant design
- modern wardrobe

## Monitoring SEO

1. Submit sitemap to Google Search Console
2. Monitor keyword rankings
3. Track organic traffic in analytics
4. Update product keywords based on performance
5. Add new keywords for trending searches

## Next Steps

1. Run the SQL migration
2. Verify sitemap: `http://localhost:3000/sitemap.xml`
3. Check robots.txt: `http://localhost:3000/robots.txt`
4. Test product metadata in browser dev tools
5. Submit to Google Search Console
6. Set up Google Analytics
7. Monitor search performance
