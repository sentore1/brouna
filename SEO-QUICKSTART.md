# SIZA SEO - Quick Start Guide

## ✅ What's Been Added

### 1. Database Schema
- **File**: `add-seo-fields.sql`
- Adds SEO columns to products table
- Auto-populates existing products with keywords

### 2. SEO Utilities
- **File**: `lib/seo.ts`
- Functions for metadata generation
- Structured data (JSON-LD) generators
- OpenGraph & Twitter card support

### 3. Enhanced Pages
- **Root Layout**: Brand-level SEO + Organization schema
- **Product Pages**: Dynamic metadata per product
- **Products Listing**: Collection SEO

### 4. Auto-Generated Files
- **Sitemap**: `/sitemap.xml` - Auto-updates with products
- **Robots.txt**: `/robots.txt` - Search engine instructions

### 5. Admin Tools
- **SEO Editor Component**: `components/SEOEditor.tsx`
- **API Endpoint**: `/api/products/[id]/seo`

## 🚀 Setup Steps

### Step 1: Run Database Migration
```bash
# Connect to your Supabase database and run:
psql -d your_database < add-seo-fields.sql

# Or in Supabase SQL Editor, paste contents of add-seo-fields.sql
```

### Step 2: Verify Installation
```bash
npm run dev
```

Visit:
- `http://localhost:3000/sitemap.xml` - Should show all pages
- `http://localhost:3000/robots.txt` - Should show crawler rules
- View page source on any product - Should see JSON-LD schema

### Step 3: Add Keywords to New Products

**When adding products, include SEO fields:**

```sql
INSERT INTO products (
  name, price, category, image, stock,
  seo_title, 
  seo_description, 
  seo_keywords
) VALUES (
  'Cashmere Sweater',
  189.99,
  'tops',
  'image.jpg',
  25,
  'Cashmere Sweater - Luxury Knitwear | SIZA',
  'Premium cashmere sweater in elegant design. Soft, luxurious knitwear crafted for sophisticated style and comfort.',
  'luxury cashmere, designer sweater, premium knitwear, cashmere top, high-end sweater, SIZA knitwear'
);
```

## 📊 SEO Features by Page

### Homepage (/)
- Title: "SIZA - Luxury High-End Fashion & Designer Clothing"
- Keywords: luxury fashion, high-end clothing, designer wear
- Schema: Organization (ClothingStore)

### Product Page (/products/[id])
- Dynamic title from product
- Product-specific keywords
- Schema: Product with pricing, availability, ratings
- OpenGraph images for social sharing

### Products Listing (/products)
- Collection-level SEO
- Category keywords

## 🎯 Keyword Strategy

Each product gets keywords in 4 categories:

1. **Category**: "luxury [category]", "designer [category]"
2. **Product**: "[product name]", "premium [product type]"
3. **Brand**: "SIZA", "SIZA [category]"
4. **Quality**: "high-end", "exclusive", "sophisticated"

**Example for a dress:**
```
luxury dresses, designer evening gowns, elegant cocktail dress, 
silk dresses, premium evening wear, SIZA dresses, [product name]
```

## 📝 Best Practices

### Title Tags
- Length: 50-60 characters
- Format: "[Product] - [Category] | SIZA"
- Include primary keyword

### Meta Descriptions
- Length: 150-160 characters
- Include call-to-action
- Mention key features
- Include "SIZA" brand name

### Keywords
- 5-10 keywords per product
- Mix of broad and specific terms
- Include brand name
- Comma-separated

## 🔧 Updating SEO for Existing Products

### Via SQL:
```sql
UPDATE products 
SET 
  seo_title = 'New Title | SIZA',
  seo_description = 'New description with keywords...',
  seo_keywords = 'keyword1, keyword2, keyword3'
WHERE id = 'product-id';
```

### Via API (in admin panel):
```javascript
await fetch(`/api/products/${productId}/seo`, {
  method: 'PATCH',
  body: JSON.stringify({
    seo_title: '...',
    seo_description: '...',
    seo_keywords: '...'
  })
})
```

## 📈 Next Steps

1. ✅ Run database migration
2. ✅ Test sitemap and robots.txt
3. 📊 Submit sitemap to Google Search Console
4. 📊 Set up Google Analytics
5. 📊 Monitor keyword rankings
6. 🔄 Update keywords based on performance
7. 📸 Add high-quality product images with alt text
8. 🔗 Build backlinks to product pages

## 🎨 Example Keywords by Category

See `seo-keywords-examples.sql` for comprehensive keyword lists for:
- Dresses
- Tops
- Bottoms
- Accessories

## 📞 Support

For questions about SEO implementation, refer to:
- `SEO-IMPLEMENTATION.md` - Detailed documentation
- `seo-keywords-examples.sql` - Keyword examples
- `lib/seo.ts` - SEO utility functions
