# 📋 SIZA SEO - QUICK REFERENCE CARD

## 🎯 Adding SEO to New Products

### SQL Template:
```sql
INSERT INTO products (name, price, category, image, stock, seo_title, seo_description, seo_keywords)
VALUES (
  '[Product Name]',
  [Price],
  '[category]',
  '[image-url]',
  [Stock],
  '[Product Name] - [Type] | SIZA',
  'Shop [Product] at SIZA. [Features]. [Material]. [CTA].',
  '[5-10 keywords, comma, separated]'
);
```

---

## 📏 SEO Field Limits

| Field | Length | Optimal |
|-------|--------|---------|
| seo_title | 60 chars max | 50-60 |
| seo_description | 160 chars max | 150-160 |
| seo_keywords | Unlimited | 5-10 keywords |

---

## 🎨 Keyword Templates by Category

### DRESSES
```
luxury dresses, designer evening gowns, elegant cocktail dress, 
silk dresses, SIZA dresses, [product name]
```

### TOPS
```
luxury blouses, designer shirts, premium tops, cashmere sweater, 
high-end knitwear, SIZA tops, [product name]
```

### BOTTOMS
```
designer pants, luxury trousers, premium jeans, elegant bottoms, 
designer denim, SIZA bottoms, [product name]
```

### ACCESSORIES
```
luxury handbags, designer bags, premium leather goods, 
elegant jewelry, SIZA accessories, [product name]
```

---

## ✅ SEO Checklist for Each Product

- [ ] Title: 50-60 characters
- [ ] Description: 150-160 characters
- [ ] Keywords: 5-10 relevant terms
- [ ] Include product name in keywords
- [ ] Include "SIZA [category]" in keywords
- [ ] Include category keywords (luxury, designer, premium)
- [ ] Include material keywords (silk, cashmere, leather)
- [ ] Include style keywords (elegant, sophisticated)

---

## 🔧 Quick Commands

### Test SEO:
```bash
node test-seo.js
```

### Generate SEO Content:
```bash
node generate-seo.js
```

### View Sitemap:
```
http://localhost:3000/sitemap.xml
```

### View Robots:
```
http://localhost:3000/robots.txt
```

---

## 📊 Update Existing Product SEO

```sql
UPDATE products 
SET 
  seo_title = '[New Title | SIZA]',
  seo_description = '[New description...]',
  seo_keywords = '[keyword1, keyword2, keyword3]'
WHERE id = '[product-id]';
```

---

## 🎯 Title Formulas

**Standard:**
`[Product Name] - [Category Type] | SIZA`

**With Material:**
`[Material] [Product] - Luxury [Category] | SIZA`

**With Style:**
`[Style] [Product] - Designer [Category] | SIZA`

**Examples:**
- Silk Evening Gown - Luxury Designer Dress | SIZA
- Cashmere Turtleneck - Premium Knitwear | SIZA
- Leather Tote Bag - Designer Handbag | SIZA

---

## 📝 Description Formula

```
Shop [Product] at SIZA. [Key Feature 1]. [Key Feature 2]. [CTA].
```

**Examples:**
- Shop Silk Evening Gown at SIZA. Exquisite designer dress with sophisticated draping. Perfect for elegant occasions. Free shipping.
- Shop Cashmere Sweater at SIZA. Premium Italian cashmere in timeless design. Soft, luxurious comfort. Elevate your wardrobe.

---

## 🔑 Essential Keywords (Use in Every Product)

**Brand:**
- SIZA
- SIZA [category]

**Quality:**
- luxury
- designer
- premium
- high-end
- exclusive

**Style:**
- elegant
- sophisticated
- timeless
- modern
- minimalist

---

## 🚀 Quick Start

1. Run: `add-seo-fields.sql` in Supabase
2. Test: `node test-seo.js`
3. Add products with SEO fields
4. Submit sitemap to Google Search Console

---

## 📞 Documentation Files

- `SEO-STEP-BY-STEP.md` - Full implementation guide
- `SEO-SUMMARY.md` - Complete overview
- `SEO-IMPLEMENTATION.md` - Technical details
- `seo-keywords-examples.sql` - More keyword examples

---

**Keep this card handy when adding products! 📌**
