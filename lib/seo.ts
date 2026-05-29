import { Metadata } from 'next'

export const siteConfig = {
  name: 'SIZA',
  description: 'Luxury high-end fashion brand offering premium designer clothing, elegant dresses, sophisticated accessories, and timeless pieces for the modern wardrobe',
  url: 'https://SIZA.com',
  ogImage: '/og-image.jpg',
  keywords: 'luxury fashion, high-end clothing, designer wear, premium apparel, elegant dresses, sophisticated style, luxury brand, designer fashion, exclusive clothing, SIZA'
}

export function generateProductMetadata(product: any): Metadata {
  const title = product.seo_title || `${product.name} - Luxury Fashion | SIZA`
  const description = product.seo_description || `Shop ${product.name} at SIZA. Premium quality ${product.category} crafted for discerning fashion enthusiasts.`
  const keywords = product.seo_keywords || `luxury ${product.category}, high-end fashion, designer ${product.category}, ${product.name}`
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}

export function generatePageMetadata(title: string, description: string, path: string = ''): Metadata {
  return {
    title: `${title} | SIZA`,
    description,
    keywords: siteConfig.keywords,
    openGraph: {
      title: `${title} | SIZA`,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SIZA`,
      description,
      images: [siteConfig.ogImage],
    },
  }
}

export function generateProductJsonLd(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [product.image],
    brand: {
      '@type': 'Brand',
      name: 'SIZA'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/products/${product.slug || product.id}`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  }
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'SIZA',
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/Logo-dark.png`,
    sameAs: [
      'https://facebook.com/SIZA',
      'https://instagram.com/SIZA',
      'https://twitter.com/SIZA'
    ]
  }
}
