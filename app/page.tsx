'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import WhatsAppChat from '../components/WhatsAppChat'
import { supabase } from '../lib/supabase'
import { formatPrice, formatPriceShort } from '../lib/currency'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  currency?: string
  slug?: string
  description?: string
}

interface SiteSettings {
  hero_type: 'image' | 'video'
  hero_content: string
  hero_title: string
  hero_subtitle: string
  site_name: string
  site_logo: string
  show_hero: boolean
  hero_border_radius: number
  hero_overlay_enabled: boolean
  hero_overlay_color: string
  hero_overlay_opacity: number
  hero_height: number
  product_grid_columns: number
  product_card_style: 'minimal' | 'detailed' | 'compact' | 'overlay' | 'bordered' | 'shadow' | 'modern' | 'classic'
  product_card_height: 'square' | 'portrait' | 'instagram' | 'landscape' | 'tall'
  price_badge_color: string
  footer_text_size: number
  footer_logo_size: number
  footer_show_border: boolean
  footer_show_logo: boolean
  footer_title_size: number
  footer_title_weight: number
  footer_title_font: string
  footer_symbol: string
  header_style: 'minimal' | 'classic' | 'modern' | 'fashion'
  hero_button_text: string
  hero_button_link: string
  hero_title_font: string
  hero_title_size: number
  product_zoom_type: 'simple' | 'detailed'
  homepage_product_limit: number
}

function parseGalleryImages(raw: any): string[] {
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw || '[]') } catch { return [] }
}

function SliderHero({ section }: { section: any }) {
  const [current, setCurrent] = useState(0)
  const images = parseGalleryImages(section.hero_gallery_images)

  useEffect(() => {
    if (images.length < 2) return
    const t = setInterval(() => setCurrent(c => (c + 1) % images.length), 4000)
    return () => clearInterval(t)
  }, [images.length])

  if (!images.length) return null

  return (
    <section className="relative bg-gray-100 overflow-hidden" style={{ height: `${section.hero_height}px`, borderRadius: `${section.hero_border_radius}px` }}>
      {images.map((url: string, i: number) => (
        <div key={i} className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700" style={{ backgroundImage: `url(${url})`, opacity: i === current ? 1 : 0 }} />
      ))}
      {section.hero_overlay_enabled && <div className="absolute inset-0" style={{ backgroundColor: section.hero_overlay_color, opacity: section.hero_overlay_opacity }} />}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="font-light mb-4 drop-shadow-lg" style={{ fontSize: `${section.hero_title_size}px`, fontFamily: section.hero_title_font }}>{section.hero_title}</h1>
        <p className="text-xl font-light drop-shadow-lg mb-6">{section.hero_subtitle}</p>
        {section.hero_button_text && <a href={section.hero_button_link || '#'} className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors">{section.hero_button_text}</a>}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_: string, i: number) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </section>
  )
}

function BrandWidget({ section }: { section: any }) {
  return (
    <section
      className="relative overflow-visible select-none w-full flex flex-col items-center justify-start"
      style={{
        backgroundColor: 'transparent',
        borderRadius: `${section.hero_border_radius || 0}px`,
        minHeight: `min(${section.hero_height || 700}px, 100vw)`,
      }}
    >
      {/* Big text — pinned to TOP, full width, behind everything */}
      {section.brand_bg_text && (
        <div className="absolute top-0 left-0 w-full pointer-events-none z-0 overflow-hidden">
          <span
            className="font-black block w-full mix-blend-multiply"
            style={{
              // ~6 chars per line max → each char ≈ 16vw keeps longest word inside viewport
              fontSize: `min(${section.brand_bg_text_size || 180}px, 16vw)`,
              color: section.brand_bg_text_color || '#000000',
              opacity: section.brand_bg_text_opacity ?? 0.15,
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {section.brand_bg_text}
          </span>
        </div>
      )}

      {/* Center image box — sits on top of text */}
      {section.brand_image_url && (
        <div
          className="relative z-10 flex items-center justify-center overflow-hidden w-full sm:w-[45%] sm:max-w-[500px] -mt-12 sm:-mt-16"
          style={{
            height: `clamp(500px, ${section.hero_height || 700}px, ${section.hero_height || 700}px)`,
          }}
        >
          <img
            src={section.brand_image_url}
            alt="brand"
            className="w-full h-full object-contain"
            style={{ pointerEvents: 'none' }}
          />
          {/* Gradient overlay — fade from white at bottom to transparent going up */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.7) 25%, transparent 35%)',
            }}
          />
          {/* Buttons inside image box at bottom */}
          {(section.brand_btn1_text || section.brand_btn2_text) && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 z-10 justify-center px-2">
              {section.brand_btn1_text && (
                <a href={section.brand_btn1_link || '#'} className="bg-black text-white px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
                  {section.brand_btn1_text}
                </a>
              )}
              {section.brand_btn2_text && (
                <a href={section.brand_btn2_link || '#'} className="border border-black text-black bg-white px-4 py-2 text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-colors whitespace-nowrap">
                  {section.brand_btn2_text}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Badge + overlay text — positioned to overlay the bottom gradient area of the image */}
      <div className="absolute bottom-16 sm:bottom-6 left-0 right-0 z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between px-4 sm:px-8 gap-1 sm:gap-0">
        {section.brand_badge_text && (
          <span
            className="font-semibold text-gray-900 tracking-wide leading-none"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 3.5rem)' }}
          >
            {section.brand_badge_text}
          </span>
        )}
        {section.brand_overlay_text && (
          <div className="sm:max-w-[22%] sm:text-right">
            <p className="text-xs text-gray-500 leading-relaxed">{section.brand_overlay_text}</p>
            {section.brand_overlay_subtext && (
              <p className="text-xs text-gray-400 mt-1">{section.brand_overlay_subtext}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function GalleryHero({ section }: { section: any }) {
  const images = parseGalleryImages(section.hero_gallery_images)
  if (!images.length) return null
  return (
    <section className="overflow-hidden" style={{ borderRadius: `${section.hero_border_radius}px` }}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`, height: `${section.hero_height}px` }}>
        {images.map((url: string, i: number) => (
          <div key={i} className="bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
        ))}
      </div>
    </section>
  )
}

const HeroSection = ({ section }: any) => {
  if (section.hero_type === 'brand') return <BrandWidget section={section} />
  if (section.hero_type === 'slider') return <SliderHero section={section} />
  if (section.hero_type === 'gallery') return <GalleryHero section={section} />
  return (
    <section className="relative bg-gray-100 flex items-center justify-center overflow-hidden" style={{ height: `${section.hero_height}px`, borderRadius: `${section.hero_border_radius}px` }}>
      {section.hero_type === 'video' ? (
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover"><source src={section.hero_content} type="video/mp4" /></video>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${section.hero_content})` }} />
      )}
      {section.hero_overlay_enabled && <div className="absolute inset-0" style={{ backgroundColor: section.hero_overlay_color, opacity: section.hero_overlay_opacity }} />}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-light mb-4 drop-shadow-lg" style={{ fontSize: `${section.hero_title_size}px`, fontFamily: section.hero_title_font }}>{section.hero_title}</h1>
        <p className="text-xl font-light drop-shadow-lg mb-6">{section.hero_subtitle}</p>
        {section.hero_button_text && <a href={section.hero_button_link || '#'} className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors">{section.hero_button_text}</a>}
      </div>
    </section>
  )
}

function ReviewCard({ reviews, offset }: { reviews: any[], offset: number }) {
  const [index, setIndex] = useState(offset % reviews.length)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 4) % reviews.length)
        setVisible(true)
      }, 1200)
    }, 8000 + offset * 1500)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const review = reviews[index]
  return (
    <div
      className="bg-white p-3 sm:p-5"
      style={{
        borderRadius: '16px',
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(6px)',
        transform: visible ? 'scale(1)' : 'scale(0.94)',
        transition: 'opacity 1.5s ease',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex gap-0.5 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${i < (review.rating ?? 5) ? 'text-black' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[8px] sm:text-[9px] text-gray-500 leading-relaxed mb-1 sm:mb-1.5 line-clamp-3">{review.text}</p>
      <p className="text-[8px] sm:text-[9px] font-semibold text-gray-700">{review.author}</p>
    </div>
  )
}

function ReviewsSection({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) return null
  const slots = Math.min(10, reviews.length)
  return (
    <div className="mt-16 mb-4 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: slots }).map((_, i) => (
          <ReviewCard key={i} reviews={reviews} offset={i} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    hero_type: 'image',
    hero_content: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    hero_title: 'brouna',
    hero_subtitle: 'Discover timeless pieces crafted for the modern minimalist',
    site_name: 'brouna',
    site_logo: '',
    show_hero: false,
    hero_border_radius: 0,
    hero_overlay_enabled: true,
    hero_overlay_color: '#000000',
    hero_overlay_opacity: 0.3,
    hero_height: 400,
    product_grid_columns: 4,
    product_card_style: 'minimal',
    product_card_height: 'square',
    price_badge_color: '#3b82f6',
    footer_text_size: 14,
    footer_logo_size: 32,
    footer_show_border: false,
    footer_show_logo: true,
    footer_title_size: 24,
    footer_title_weight: 600,
    footer_title_font: 'inherit',
    footer_symbol: '™',
    header_style: 'minimal',
    hero_button_text: '',
    hero_button_link: '',
    hero_title_font: 'inherit',
    hero_title_size: 48,
    product_zoom_type: 'simple',
    homepage_product_limit: 16
  })

  const [cartCount, setCartCount] = useState(0)
  const [categories, setCategories] = useState<string[]>(['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'])
  const [heroSections, setHeroSections] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchSiteSettings()
    updateCartCount()
    fetchCategories()
    fetchHeroSections()
    fetchReviews()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('name').order('name')
      if (data && !error) {
        const cats = ['All', ...data.map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1))]
        setCategories(cats)
      }
    } catch (error) {
      console.log('Using default categories')
    }
  }

  const fetchHeroSections = async () => {
    try {
      const { data, error } = await supabase.from('hero_sections').select('*').order('position')
      if (data && !error) setHeroSections(data)
    } catch (error) {
      console.log('No hero sections found')
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      if (res.ok) setReviews(await res.json())
    } catch {}
  }

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single()
      if (data && !error) {
        // Parse site_logo if it's stored as JSON
        let parsedData = { ...data }
        if (data.site_logo && data.site_logo.startsWith('{')) {
          try {
            const parsed = JSON.parse(data.site_logo)
            parsedData.site_logo = parsed.logo || ''
          } catch {}
        }
        setSiteSettings(parsedData)
      }
    } catch (error) {
      console.log('Using default site settings')
    }
  }

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(count)
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const limit = siteSettings.homepage_product_limit || 16
  const displayedProducts = filteredProducts.slice(0, limit)
  const hasMore = filteredProducts.length > limit

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} categories={categories} siteLogo={siteSettings.site_logo} siteName={siteSettings.site_name} headerStyle={siteSettings.header_style} logoSize={60} />
      <WhatsAppChat />
      
      {siteSettings.show_hero && (
        <div className="max-w-7xl mx-auto px-4 my-4"><HeroSection section={siteSettings} /></div>
      )}

      {heroSections.filter((s: any) => s.enabled && (!s.vertical_position || s.vertical_position === 'top')).map((section: any) => (
        <div key={section.id} className="max-w-7xl mx-auto px-4 my-4"><HeroSection section={section} /></div>
      ))}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {heroSections.filter((s: any) => s.enabled && s.vertical_position === 'middle').map((section: any) => (
          <div key={section.id} className="mb-8"><HeroSection section={section} /></div>
        ))}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <style dangerouslySetInnerHTML={{__html: `.product-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}@media (min-width:768px){.product-grid{grid-template-columns:repeat(${siteSettings.product_grid_columns||4},minmax(0,1fr))}}.product-zoom-simple:hover img{transform:scale(1.05)}.product-zoom-detailed:hover img{transform:scale(1.5)}.card-square{aspect-ratio:1/1}.card-portrait{aspect-ratio:3/4}.card-instagram{aspect-ratio:4/5}.card-landscape{aspect-ratio:4/3}.card-tall{aspect-ratio:2/3}`}} />
            <div className="product-grid">
            {displayedProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer" data-product-id={product.id} onClick={() => window.location.href = `/products/${product.slug || product.id}`}>
                {siteSettings.product_card_style === 'overlay' ? (
                  <div className={`bg-gray-50 overflow-hidden rounded-xl relative card-${siteSettings.product_card_height || 'square'}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm opacity-90">{formatPriceShort(product.price, product.currency)}</p>
                      </div>
                    </div>
                  </div>
                ) : siteSettings.product_card_style === 'bordered' ? (
                  <>
                    <div className={`bg-white overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-black transition-colors relative mb-3 card-${siteSettings.product_card_height || 'square'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                      <p className="font-medium">{formatPriceShort(product.price, product.currency)}</p>
                    </div>
                  </>
                ) : siteSettings.product_card_style === 'shadow' ? (
                  <>
                    <div className={`bg-white overflow-hidden rounded-2xl shadow-md group-hover:shadow-2xl transition-shadow duration-300 relative mb-3 card-${siteSettings.product_card_height || 'square'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                    </div>
                    <div className="px-2 space-y-1">
                      <h3 className="font-bold text-gray-900">{product.name}</h3>
                      <p className="text-lg font-semibold">{formatPriceShort(product.price, product.currency)}</p>
                    </div>
                  </>
                ) : siteSettings.product_card_style === 'modern' ? (
                  <div className="bg-gray-50 rounded-2xl overflow-hidden group-hover:bg-gray-100 transition-colors">
                    <div className={`overflow-hidden relative card-${siteSettings.product_card_height || 'square'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-lg font-bold">{formatPriceShort(product.price, product.currency)}</p>
                    </div>
                  </div>
                ) : siteSettings.product_card_style === 'classic' ? (
                  <>
                    <div className={`bg-white overflow-hidden border border-gray-300 relative mb-3 card-${siteSettings.product_card_height || 'square'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                      <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-sm font-medium">{formatPriceShort(product.price, product.currency)}</div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 uppercase tracking-wide text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`bg-gray-50 overflow-hidden relative mb-3 product-zoom-${siteSettings.product_zoom_type || 'simple'} card-${siteSettings.product_card_height || 'square'} ${siteSettings.product_card_style === 'compact' ? 'rounded-lg' : 'rounded-xl'}`}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300" onError={(e) => {(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}} />
                      <div className="absolute top-3 left-3">
                        <span className="text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: siteSettings.price_badge_color || '#3b82f6' }}>{formatPriceShort(product.price, product.currency)}</span>
                      </div>
                    </div>
                    <div className={siteSettings.product_card_style === 'detailed' ? 'space-y-2' : 'space-y-1'}>
                      <h3 className={`font-semibold text-gray-900 group-hover:text-black transition-colors ${siteSettings.product_card_style === 'compact' ? 'text-sm' : ''}`}>{product.name}</h3>
                      <p className={`text-gray-500 capitalize ${siteSettings.product_card_style === 'compact' ? 'text-xs' : 'text-sm'}`}>{product.category}</p>
                      {siteSettings.product_card_style === 'detailed' && <p className="text-sm text-gray-600 line-clamp-2">{product.description || 'Premium quality product'}</p>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-10">
              <a href="/products" className="inline-block border border-black text-black px-10 py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors">
                View All Products ({filteredProducts.length})
              </a>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}

        {heroSections.filter((s: any) => s.enabled && s.vertical_position === 'bottom').map((section: any) => (
          <div key={section.id} className="mt-8"><HeroSection section={section} /></div>
        ))}

        {/* Product Spotlight Widget */}
        {(siteSettings as any).spotlight_enabled && (siteSettings as any).spotlight_title && (
          <div className="mt-12 mb-4 w-full">
            <div
              className="relative overflow-hidden rounded-2xl w-full"
              style={{
                backgroundColor: (siteSettings as any).spotlight_bg_color || '#f5f5f5',
                minHeight: '380px',
              }}
            >
              {/* Text — top left */}
              <div className="absolute top-8 left-8 z-10">
                <p className="text-2xl font-bold text-gray-900 leading-tight">{(siteSettings as any).spotlight_title}</p>
                {(siteSettings as any).spotlight_subtitle && (
                  <p className="text-base text-gray-500 mt-1">{(siteSettings as any).spotlight_subtitle}</p>
                )}
              </div>
              {/* Image — centered */}
              {(siteSettings as any).spotlight_image && (
                <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '380px' }}>
                  <img
                    src={(siteSettings as any).spotlight_image}
                    alt={(siteSettings as any).spotlight_title}
                    className="object-contain"
                    style={{ maxHeight: '320px', maxWidth: '60%' }}
                  />
                </div>
              )}
              {/* Price — bottom left */}
              {(siteSettings as any).spotlight_price && (
                <div className="absolute bottom-8 left-8 z-10">
                  <p className="text-sm text-gray-500">{(siteSettings as any).spotlight_price_prefix || 'From'}</p>
                  <p className="text-3xl font-bold text-gray-900">{(siteSettings as any).spotlight_price}</p>
                </div>
              )}
              {/* Arrow — bottom right */}
              {(siteSettings as any).spotlight_link && (
                <a
                  href={(siteSettings as any).spotlight_link}
                  className="absolute bottom-0 right-0 z-10 w-16 h-16 bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              )}
            </div>

            {/* Reviews Section inside Spotlight */}
            {reviews.length > 0 && (siteSettings as any).reviews_enabled !== false && (
              <div className="mt-8">
                <ReviewsSection reviews={reviews} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
