'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, LogOut, Settings, Image, Video, Layout } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import HeroSectionsManager from '../../components/HeroSectionsManager'
import AnalyticsPanel from '../../components/AnalyticsPanel'
import OrdersPanel from '../../components/OrdersPanel'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  images?: string
  stock?: number
  currency?: string
  created_at: string
  slug?: string
  sizes?: string
  colors?: string
  sale_end_date?: string
  viewers_count?: number
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
}

interface SiteSettings {
  id?: string
  hero_type: 'image' | 'video'
  hero_content: string
  hero_title: string
  hero_subtitle: string
  header_style: 'minimal' | 'classic' | 'modern'
  footer_style: 'simple' | 'detailed' | 'minimal'
  site_name: string
  site_logo: string
  show_hero: boolean
  hero_border_radius: number
  hero_overlay_enabled: boolean
  hero_overlay_color: string
  hero_overlay_opacity: number
  hero_height: number
  homepage_product_limit: number
  product_grid_columns: number
  product_card_style: 'minimal' | 'detailed' | 'compact'
  price_badge_color: string
  footer_text_size: number
  footer_logo_size: number
  footer_show_border: boolean
  footer_show_logo: boolean
  footer_title_size: number
  footer_title_weight: number
  footer_title_font: string
  footer_title_line_height: number
  footer_symbol: string
  hero_button_text: string
  hero_button_link: string
  hero_title_font: string
  hero_title_size: number
  product_zoom_type: 'simple' | 'detailed'
  product_page_layout: 'default' | 'fullscreen'
  add_to_cart_button_text: string
  product_card_height: 'square' | 'portrait' | 'instagram' | 'landscape' | 'tall'
  payment_paypal_enabled: boolean
  payment_kpay_enabled: boolean
  payment_momo_enabled: boolean
  payment_polar_enabled: boolean
  polar_product_id: string
  momo_number: string
  momo_name: string
  momo_instructions: string
  momo_dial_code: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products')
  const [uploadingSpotlight, setUploadingSpotlight] = useState(false)
  const [reviews, setReviews] = useState<{id: string, author: string, text: string, rating: number, sort_order: number}[]>([])
  const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5 })
  const [footerLinks, setFooterLinks] = useState<{id: string, label: string, url: string, sort_order: number, enabled: boolean}[]>([])
  const [newFooterLink, setNewFooterLink] = useState({ label: '', url: '' })
  const [pages, setPages] = useState<{id: string, title: string, slug: string, content: string, enabled: boolean}[]>([])
  const [editingPage, setEditingPage] = useState<{id: string, title: string, slug: string, content: string, enabled: boolean} | null>(null)
  const [newPage, setNewPage] = useState({ title: '', content: '' })
  const [products, setProducts] = useState<Product[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<string[]>(['tops', 'bottoms', 'dresses', 'accessories'])
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string} | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    homepage_product_limit: 8,
    hero_type: 'image',
    hero_content: '/hero-image.jpg',
    hero_title: 'brouna',
    hero_subtitle: 'Discover timeless pieces crafted for the modern minimalist',
    header_style: 'minimal',
    footer_style: 'simple',
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
    price_badge_color: '#3b82f6',
    footer_text_size: 14,
    footer_logo_size: 32,
    footer_show_border: false,
    footer_show_logo: true,
    footer_title_size: 24,
    footer_title_weight: 600,
    footer_title_font: 'inherit',
    footer_title_line_height: 1.2,
    footer_symbol: '™',
    hero_button_text: '',
    hero_button_link: '',
    hero_title_font: 'inherit',
    hero_title_size: 48,
    product_zoom_type: 'simple',
    product_page_layout: 'default',
    add_to_cart_button_text: 'Add to Cart',
    product_card_height: 'square',
    payment_paypal_enabled: true,
    payment_kpay_enabled: true,
    payment_momo_enabled: false,
    payment_polar_enabled: false,
    polar_product_id: '',
    momo_number: '',
    momo_name: '',
    momo_instructions: 'Scan the QR code or tap to dial, then enter your transaction ID.',
    momo_dial_code: '+250',
  })
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    images: [''],
    stock: '',
    currency: 'USD',
    sizes: '',
    colors: '',
    sale_end_date: '',
    viewers_count: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  })
  const [previewImages, setPreviewImages] = useState<string[]>(['']) // kept for compat but derived from formData.images
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // First try getSession (fast, from storage)
      const { data: { session } } = await supabase.auth.getSession()
      if (session && session.user.email === '4brohz@gmail.com') return

      // If no session yet, wait for auth state to resolve
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== '4brohz@gmail.com') {
        router.push('/login')
      }
    }
    checkAuth()
    fetchProducts()
    fetchSiteSettings()
    fetchCategories()
    fetchFooterLinks()
    fetchPages()
    fetchReviews()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name')
      
      if (data && !error) {
        setCategories(data.map(c => c.name))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const addCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.toLowerCase().trim())) {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.toLowerCase().trim() }])
      
      if (!error) {
        setNewCategory('')
        fetchCategories()
      } else {
        alert('Error adding category')
      }
    }
  }

  const removeCategory = async (cat: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', cat)
    
    if (!error) {
      fetchCategories()
    } else {
      alert('Error removing category')
    }
  }

  const updateCategory = async () => {
    if (editingCategory && editingCategory.new.trim()) {
      const { error } = await supabase
        .from('categories')
        .update({ name: editingCategory.new.toLowerCase().trim() })
        .eq('name', editingCategory.old)
      
      if (!error) {
        setEditingCategory(null)
        fetchCategories()
      } else {
        alert('Error updating category')
      }
    }
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, category, image, images, stock, currency, created_at, slug, sizes, colors, sale_end_date, viewers_count, seo_title, seo_description, seo_keywords')
        .order('created_at', { ascending: false })
        .limit(50)
      
      console.log('[fetchProducts] data:', data, 'error:', error)
      if (error) {
        console.error('[fetchProducts] Supabase error:', error.message, error.code, error.details)
      }
      if (data && !error) setProducts(data)
    } catch (error) {
      console.error('[fetchProducts] Exception:', error)
    }
  }

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()
      
      if (data && !error) {
        // Parse MoMo settings from site_logo if stored as JSON
        let parsedData = { ...data }
        if (data.site_logo && data.site_logo.startsWith('{')) {
          try {
            const parsed = JSON.parse(data.site_logo)
            if (parsed.momo) {
              parsedData = { ...parsedData, ...parsed.momo, site_logo: parsed.logo || '' }
            }
          } catch {}
        }
        setSiteSettings(parsedData)
      }
    } catch (error) {
      console.log('No site settings found, using defaults')
    }
  }

  const saveSiteSettings = async () => {
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single()

      if (existing?.id) {
        // Build payload with all standard fields
        const payload: any = {
          hero_type: siteSettings.hero_type,
          hero_content: siteSettings.hero_content,
          hero_title: siteSettings.hero_title,
          hero_subtitle: siteSettings.hero_subtitle,
          header_style: siteSettings.header_style,
          footer_style: siteSettings.footer_style,
          site_name: siteSettings.site_name,
          show_hero: siteSettings.show_hero,
          hero_border_radius: siteSettings.hero_border_radius,
          hero_overlay_enabled: siteSettings.hero_overlay_enabled,
          hero_overlay_color: siteSettings.hero_overlay_color,
          hero_overlay_opacity: siteSettings.hero_overlay_opacity,
          hero_height: siteSettings.hero_height,
          homepage_product_limit: siteSettings.homepage_product_limit,
          product_grid_columns: siteSettings.product_grid_columns,
          product_card_style: siteSettings.product_card_style,
          price_badge_color: siteSettings.price_badge_color,
          footer_text_size: siteSettings.footer_text_size,
          footer_logo_size: siteSettings.footer_logo_size,
          footer_show_border: siteSettings.footer_show_border,
          footer_show_logo: siteSettings.footer_show_logo,
          footer_title_size: siteSettings.footer_title_size,
          footer_title_weight: siteSettings.footer_title_weight,
          footer_title_font: siteSettings.footer_title_font,
          footer_title_line_height: siteSettings.footer_title_line_height,
          footer_symbol: siteSettings.footer_symbol,
          hero_button_text: siteSettings.hero_button_text,
          hero_button_link: siteSettings.hero_button_link,
          hero_title_font: siteSettings.hero_title_font,
          hero_title_size: siteSettings.hero_title_size,
          product_zoom_type: siteSettings.product_zoom_type,
          product_page_layout: siteSettings.product_page_layout,
          add_to_cart_button_text: siteSettings.add_to_cart_button_text,
          product_card_height: siteSettings.product_card_height,
          payment_paypal_enabled: siteSettings.payment_paypal_enabled,
          payment_kpay_enabled: siteSettings.payment_kpay_enabled,
          payment_polar_enabled: siteSettings.payment_polar_enabled,
          polar_product_id: siteSettings.polar_product_id,
          spotlight_enabled: (siteSettings as any).spotlight_enabled ?? false,
          spotlight_image: (siteSettings as any).spotlight_image ?? '',
          spotlight_title: (siteSettings as any).spotlight_title ?? '',
          spotlight_subtitle: (siteSettings as any).spotlight_subtitle ?? '',
          spotlight_price: (siteSettings as any).spotlight_price ?? '',
          spotlight_price_prefix: (siteSettings as any).spotlight_price_prefix ?? 'From',
          spotlight_link: (siteSettings as any).spotlight_link ?? '',
          spotlight_width: (siteSettings as any).spotlight_width ?? 320,
          spotlight_bg_color: (siteSettings as any).spotlight_bg_color ?? '#f5f5f5',
          reviews_enabled: (siteSettings as any).reviews_enabled ?? false,
        }

        // Store MoMo settings and logo in site_logo as JSON (workaround for missing columns)
        const momoSettings = {
          payment_momo_enabled: siteSettings.payment_momo_enabled,
          momo_number: siteSettings.momo_number,
          momo_name: siteSettings.momo_name,
          momo_instructions: siteSettings.momo_instructions,
          momo_dial_code: siteSettings.momo_dial_code
        }
        payload.site_logo = JSON.stringify({ logo: siteSettings.site_logo, momo: momoSettings })

        const { error } = await supabase
          .from('site_settings')
          .update(payload)
          .eq('id', existing.id)
        
        if (error) {
          alert(`Save error: ${error.message}`)
        } else {
          alert('Settings saved successfully!')
          // Refresh settings to ensure UI is in sync
          fetchSiteSettings()
        }
      }
    } catch (err: any) {
      alert(`Exception: ${err?.message || JSON.stringify(err)}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.images[0],
      images: JSON.stringify(formData.images.filter(img => img && img.trim() !== '')),
      stock: parseInt(formData.stock),
      currency: formData.currency,
      slug: slug,
      sizes: formData.sizes,
      colors: formData.colors,
      sale_end_date: formData.sale_end_date || null,
      viewers_count: parseInt(formData.viewers_count) || 0,
      seo_title: formData.seo_title,
      seo_description: formData.seo_description,
      seo_keywords: formData.seo_keywords
    }

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([productData])
    }

    setFormData({ name: '', price: '', description: '', category: '', images: [''], stock: '', currency: 'USD', sizes: '', colors: '', sale_end_date: '', viewers_count: '', seo_title: '', seo_description: '', seo_keywords: '' })
    setShowAddForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const handleEdit = (product: Product) => {
    let images = [product.image || '']
    if (product.images) {
      try {
        const parsedImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images
        if (Array.isArray(parsedImages)) {
          images = parsedImages.filter(img => img && img.trim() !== '')
        }
      } catch {
        images = [product.image || '']
      }
    }
    // Ensure at least one image field
    if (images.length === 0) {
      images = [product.image || '']
    }
    
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      images: images,
      stock: (product.stock || 0).toString(),
      currency: product.currency || 'USD',
      sizes: product.sizes || '',
      colors: product.colors || '',
      sale_end_date: product.sale_end_date || '',
      viewers_count: (product.viewers_count || 0).toString(),
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      seo_keywords: product.seo_keywords || ''
    })
    setPreviewImages(images)
    setShowAddForm(true)
  }

  const addImageField = () => {
    const newImages = [...formData.images, '']
    setFormData({ ...formData, images: newImages })
    setPreviewImages(newImages)
  }

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    setPreviewImages(newImages)
  }

  const updateImageUrl = (index: number, url: string) => {
    const newImages = [...formData.images]
    newImages[index] = url
    setFormData({ ...formData, images: newImages })
    setPreviewImages([...newImages])
  }

  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => callback(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const fetchFooterLinks = async () => {
    const { data } = await supabase.from('footer_links').select('*').order('sort_order')
    if (data) setFooterLinks(data)
  }

  const addFooterLink = async () => {
    if (!newFooterLink.label.trim() || !newFooterLink.url.trim()) return
    await supabase.from('footer_links').insert([{ ...newFooterLink, sort_order: footerLinks.length, enabled: true }])
    setNewFooterLink({ label: '', url: '' })
    fetchFooterLinks()
  }

  const deleteFooterLink = async (id: string) => {
    await supabase.from('footer_links').delete().eq('id', id)
    fetchFooterLinks()
  }

  const toggleFooterLink = async (id: string, enabled: boolean) => {
    await supabase.from('footer_links').update({ enabled }).eq('id', id)
    fetchFooterLinks()
  }

  const fetchPages = async () => {
    const { data } = await supabase.from('pages').select('*').order('sort_order')
    if (data) setPages(data)
  }

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews')
    if (res.ok) setReviews(await res.json())
  }

  const addReview = async () => {
    if (!newReview.author.trim() || !newReview.text.trim()) return
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newReview, sort_order: reviews.length }),
    })
    setNewReview({ author: '', text: '', rating: 5 })
    fetchReviews()
  }

  const deleteReview = async (id: string) => {
    await fetch('/api/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchReviews()
  }

  const updateReview = async (id: string, updates: any) => {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    fetchReviews()
  }

  const savePage = async () => {
    if (!newPage.title.trim()) return
    const slug = newPage.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    await supabase.from('pages').insert([{ title: newPage.title, slug, content: newPage.content, enabled: true, sort_order: pages.length }])
    setNewPage({ title: '', content: '' })
    fetchPages()
  }

  const updatePage = async () => {
    if (!editingPage) return
    await supabase.from('pages').update({ title: editingPage.title, content: editingPage.content, enabled: editingPage.enabled }).eq('id', editingPage.id)
    setEditingPage(null)
    fetchPages()
  }

  const deletePage = async (id: string) => {
    if (!confirm('Delete this page?')) return
    await supabase.from('pages').delete().eq('id', id)
    fetchPages()
  }

  const handleSpotlightImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingSpotlight(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      setSiteSettings({ ...siteSettings, spotlight_image: json.url } as any)
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploadingSpotlight(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light tracking-wide">Admin Dashboard</h1>
          <button
            onClick={() => {
              supabase.auth.signOut()
              router.push('/')
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg border overflow-x-auto">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'analytics', label: 'Analytics', icon: Settings },
            { id: 'categories', label: 'Categories', icon: Layout },
            { id: 'seo', label: 'SEO', icon: Settings },
            { id: 'site', label: 'Site Settings', icon: Settings },
            { id: 'hero-sections', label: 'Hero Sections', icon: Image },
            { id: 'hero', label: 'Legacy Hero', icon: Video },
            { id: 'layout', label: 'Layout', icon: Layout }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsPanel />}

        {/* Hero Sections Manager Tab */}
        {activeTab === 'hero-sections' && <HeroSectionsManager />}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">SEO Management</h2>
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="border-b pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">SEO Title ({(product.seo_title || '').length}/60)</label>
                      <input
                        type="text"
                        value={product.seo_title || ''}
                        onChange={async (e) => {
                          const val = e.target.value
                          await supabase.from('products').update({ seo_title: val }).eq('id', product.id)
                          fetchProducts()
                        }}
                        maxLength={60}
                        className="w-full p-2 border rounded text-sm"
                        placeholder={`${product.name} - ${product.category} | brouna`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Meta Description ({(product.seo_description || '').length}/160)</label>
                      <textarea
                        value={product.seo_description || ''}
                        onChange={async (e) => {
                          const val = e.target.value
                          await supabase.from('products').update({ seo_description: val }).eq('id', product.id)
                          fetchProducts()
                        }}
                        maxLength={160}
                        rows={2}
                        className="w-full p-2 border rounded text-sm"
                        placeholder={`Shop ${product.name} at brouna. Premium quality ${product.category}...`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={product.seo_keywords || ''}
                        onChange={async (e) => {
                          const val = e.target.value
                          await supabase.from('products').update({ seo_keywords: val }).eq('id', product.id)
                          fetchProducts()
                        }}
                        className="w-full p-2 border rounded text-sm"
                        placeholder={`${product.category}, designer wear, ${product.name}, brouna`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrdersPanel />}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Products ({products.length})</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-black text-white px-6 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-10 h-10 rounded object-cover mr-4"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'
                              }}
                            />
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.currency === 'USD' ? `$${product.price}` : `${product.price} RWF`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.stock || 0}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">Manage Categories</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="New category name"
                  className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <button
                  onClick={addCategory}
                  className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    {editingCategory?.old === cat ? (
                      <input
                        type="text"
                        value={editingCategory.new}
                        onChange={(e) => setEditingCategory({...editingCategory, new: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' && updateCategory()}
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                        autoFocus
                      />
                    ) : (
                      <span className="capitalize">{cat}</span>
                    )}
                    <div className="flex gap-2">
                      {editingCategory?.old === cat ? (
                        <>
                          <button
                            onClick={updateCategory}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingCategory({old: cat, new: cat})}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeCategory(cat)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'site' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">General Site Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site Logo URL</label>
                  <input
                    type="url"
                    value={siteSettings.site_logo}
                    onChange={(e) => setSiteSettings({...siteSettings, site_logo: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="Logo URL"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-base font-medium mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!siteSettings.payment_paypal_enabled} onChange={(e) => setSiteSettings({...siteSettings, payment_paypal_enabled: e.target.checked})} className="w-4 h-4" />
                    <span className="font-medium">Enable PayPal</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!siteSettings.payment_kpay_enabled} onChange={(e) => setSiteSettings({...siteSettings, payment_kpay_enabled: e.target.checked})} className="w-4 h-4" />
                    <span className="font-medium">Enable KPay</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!siteSettings.payment_momo_enabled} onChange={(e) => setSiteSettings({...siteSettings, payment_momo_enabled: e.target.checked})} className="w-4 h-4" />
                    <span className="font-medium">Enable MoMo (Mobile Money QR)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!siteSettings.payment_polar_enabled} onChange={(e) => setSiteSettings({...siteSettings, payment_polar_enabled: e.target.checked})} className="w-4 h-4" />
                    <span className="font-medium">Enable Polar (Merchant of Record)</span>
                  </label>

                  {siteSettings.payment_polar_enabled && (
                    <div className="ml-7 space-y-3 border-l-2 border-blue-200 pl-4 bg-blue-50 p-3 rounded">
                      <div>
                        <label className="block text-sm font-medium mb-1">Polar Product ID</label>
                        <input
                          type="text"
                          value={siteSettings.polar_product_id || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, polar_product_id: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
                          placeholder="prod_xxxxxxxxxxxxx"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Get this from your Polar dashboard → Products → Copy Product ID
                        </p>
                      </div>
                      <div className="bg-white border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-800 font-medium mb-1">📘 Setup Required:</p>
                        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                          <li>Add POLAR_ACCESS_TOKEN to .env.local</li>
                          <li>Add POLAR_WEBHOOK_SECRET to .env.local</li>
                          <li>Run add-polar-settings.sql migration</li>
                          <li>See POLAR-SETUP.md for full guide</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {siteSettings.payment_momo_enabled && (
                    <div className="ml-7 space-y-3 border-l-2 border-gray-200 pl-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">MoMo Merchant Code</label>
                        <input
                          type="text"
                          value={siteSettings.momo_number || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, momo_number: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black font-mono"
                          placeholder="e.g. 123456"
                        />
                        <p className="text-xs text-gray-400 mt-1">Your MoMo merchant code. Users will dial: *180*8*1*[YOUR_CODE]*[AMOUNT]#</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Account Name</label>
                        <input
                          type="text"
                          value={siteSettings.momo_name || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, momo_name: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          placeholder="e.g. SIZA FURNITURE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Instructions</label>
                        <textarea
                          value={siteSettings.momo_instructions || ''}
                          onChange={(e) => setSiteSettings({...siteSettings, momo_instructions: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                          rows={3}
                          placeholder="Instructions shown to customer after selecting MoMo"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="border-t pt-6">
                <h3 className="text-base font-medium mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!(siteSettings as any).reviews_enabled}
                      onChange={(e) => setSiteSettings({...siteSettings, reviews_enabled: e.target.checked} as any)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Show Reviews on Homepage</span>
                  </label>

                  {/* Existing reviews */}
                  {reviews.length > 0 && (
                    <div className="space-y-2">
                      {reviews.map((r) => (
                        <div key={r.id} className="border rounded p-3 flex gap-3 items-start">
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={r.author}
                              onChange={(e) => updateReview(r.id, { author: e.target.value })}
                              className="w-full text-xs font-medium border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none py-0.5"
                              placeholder="Author name"
                            />
                            <textarea
                              value={r.text}
                              onChange={(e) => updateReview(r.id, { text: e.target.value })}
                              className="w-full text-xs text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none resize-none py-0.5"
                              rows={2}
                              placeholder="Review text"
                            />
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => (
                                <button key={s} onClick={() => updateReview(r.id, { rating: s })}
                                  className={`text-xs ${s <= r.rating ? 'text-black' : 'text-gray-300'}`}>★</button>
                              ))}
                            </div>
                          </div>
                          <button onClick={() => deleteReview(r.id)} className="text-gray-400 hover:text-red-500 text-xs mt-1">✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new review */}
                  <div className="border rounded p-3 space-y-2 bg-gray-50">
                    <p className="text-xs font-medium text-gray-700">Add Review</p>
                    <input
                      type="text"
                      value={newReview.author}
                      onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                      className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="Customer name"
                    />
                    <textarea
                      value={newReview.text}
                      onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                      className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-black resize-none"
                      rows={2}
                      placeholder="Review text"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Rating:</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setNewReview({...newReview, rating: s})}
                            className={`text-sm ${s <= newReview.rating ? 'text-black' : 'text-gray-300'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={addReview}
                      className="bg-black text-white text-xs px-4 py-1.5 rounded hover:bg-gray-800 transition-colors"
                    >
                      Add Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Spotlight Widget */}
              <div className="border-t pt-6">
                <h3 className="text-base font-medium mb-4">Product Spotlight Widget (Below Product Page)</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!(siteSettings as any).spotlight_enabled}
                      onChange={(e) => setSiteSettings({...siteSettings, spotlight_enabled: e.target.checked} as any)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Show Spotlight Widget</span>
                  </label>

                  {(siteSettings as any).spotlight_enabled && (
                    <div className="ml-7 space-y-3 border-l-2 border-gray-200 pl-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Product Image (PNG recommended)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_image || ''}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_image: e.target.value} as any)}
                            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="https://... or upload below"
                          />
                          <label className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-sm font-medium whitespace-nowrap ${uploadingSpotlight ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploadingSpotlight ? 'Uploading...' : '↑ Upload'}
                            <input type="file" accept="image/*" className="hidden" onChange={handleSpotlightImageUpload} />
                          </label>
                        </div>
                        {(siteSettings as any).spotlight_image && (
                          <img src={(siteSettings as any).spotlight_image} alt="preview" className="mt-2 h-24 object-contain rounded border" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_title || ''}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_title: e.target.value} as any)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="e.g. Coco Crush ring"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_subtitle || ''}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_subtitle: e.target.value} as any)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="e.g. 18K yellow"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Price Prefix</label>
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_price_prefix || 'From'}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_price_prefix: e.target.value} as any)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="From"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Price</label>
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_price || ''}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_price: e.target.value} as any)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="e.g. $25,550"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Link (arrow button)</label>
                          <input
                            type="text"
                            value={(siteSettings as any).spotlight_link || ''}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_link: e.target.value} as any)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            placeholder="/products/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Background Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={(siteSettings as any).spotlight_bg_color || '#f5f5f5'}
                              onChange={(e) => setSiteSettings({...siteSettings, spotlight_bg_color: e.target.value} as any)}
                              className="w-10 h-10 border rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={(siteSettings as any).spotlight_bg_color || '#f5f5f5'}
                              onChange={(e) => setSiteSettings({...siteSettings, spotlight_bg_color: e.target.value} as any)}
                              className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Card Width (px)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={200}
                            max={600}
                            value={(siteSettings as any).spotlight_width || 320}
                            onChange={(e) => setSiteSettings({...siteSettings, spotlight_width: parseInt(e.target.value)} as any)}
                            className="flex-1"
                          />
                          <span className="text-sm font-mono w-16 text-right">{(siteSettings as any).spotlight_width || 320}px</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={saveSiteSettings}
                className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                Save Site Settings
              </button>

              {/* Footer Page Links */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-base font-medium mb-1">Footer Page Links</h3>
                <p className="text-sm text-gray-500 mb-4">These links appear horizontally above the copyright line in the footer. You can link to custom pages or any URL.</p>
                <div className="space-y-2 mb-4">
                  {footerLinks.map((link) => (
                    <div key={link.id} className="flex items-center gap-3 p-3 border rounded">
                      <input type="checkbox" checked={link.enabled} onChange={(e) => toggleFooterLink(link.id, e.target.checked)} className="w-4 h-4" />
                      <span className="flex-1 text-sm font-medium">{link.label}</span>
                      <span className="text-sm text-gray-400 truncate max-w-[200px]">{link.url}</span>
                      <button onClick={() => deleteFooterLink(link.id)} className="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
                    </div>
                  ))}
                  {footerLinks.length === 0 && <p className="text-sm text-gray-400">No links yet.</p>}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Label (e.g. Privacy Policy)" value={newFooterLink.label} onChange={(e) => setNewFooterLink({ ...newFooterLink, label: e.target.value })} className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" />
                  <input type="text" placeholder="URL (e.g. /pages/privacy-policy)" value={newFooterLink.url} onChange={(e) => setNewFooterLink({ ...newFooterLink, url: e.target.value })} className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black" />
                  <button onClick={addFooterLink} className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors rounded">Add</button>
                </div>
              </div>

              {/* Pages Manager */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-base font-medium mb-1">Pages</h3>
                <p className="text-sm text-gray-500 mb-4">Create pages like Privacy Policy, About, Terms, etc. Each gets a URL like <code className="bg-gray-100 px-1 rounded">/pages/your-title</code>. Then add it as a footer link above.</p>

                {/* Existing pages */}
                <div className="space-y-3 mb-6">
                  {pages.map((page) => (
                    <div key={page.id} className="border rounded p-4">
                      {editingPage?.id === page.id ? (
                        <div className="space-y-3">
                          <input type="text" value={editingPage.title} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black font-medium" />
                          <textarea value={editingPage.content} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })} rows={8} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black font-mono resize-y" placeholder="Page content..." />
                          <div className="flex gap-2">
                            <button onClick={updatePage} className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 rounded">Save</button>
                            <button onClick={() => setEditingPage(null)} className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 rounded">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{page.title}</p>
                            <p className="text-xs text-gray-400">/pages/{page.slug}</p>
                          </div>
                          <button onClick={() => setEditingPage(page)} className="text-sm text-gray-600 hover:text-black px-2">Edit</button>
                          <button onClick={() => deletePage(page.id)} className="text-sm text-red-500 hover:text-red-700 px-2">Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {pages.length === 0 && <p className="text-sm text-gray-400">No pages yet.</p>}
                </div>

                {/* New page form */}
                <div className="border rounded p-4 space-y-3 bg-gray-50">
                  <p className="text-sm font-medium">New Page</p>
                  <input type="text" placeholder="Title (e.g. Privacy Policy)" value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white" />
                  <textarea placeholder="Page content..." value={newPage.content} onChange={(e) => setNewPage({ ...newPage, content: e.target.value })} rows={6} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white resize-y" />
                  <button onClick={savePage} className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 rounded">Create Page</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">Legacy Hero Section (Deprecated - Use Hero Sections Tab)</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!siteSettings.show_hero}
                    onChange={(e) => {
                      setSiteSettings({...siteSettings, show_hero: e.target.checked})
                    }}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-medium">Show Hero Section</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hero Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="image"
                      checked={siteSettings.hero_type === 'image'}
                      onChange={(e) => setSiteSettings({...siteSettings, hero_type: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="video"
                      checked={siteSettings.hero_type === 'video'}
                      onChange={(e) => setSiteSettings({...siteSettings, hero_type: e.target.value as 'image' | 'video'})}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {siteSettings.hero_type === 'image' ? 'Hero Image' : 'Hero Video'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={siteSettings.hero_content}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_content: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder={siteSettings.hero_type === 'image' ? 'Image URL' : 'Video URL'}
                  />
                  <input
                    type="file"
                    accept={siteSettings.hero_type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file, (url) => setSiteSettings({...siteSettings, hero_content: url}))
                      }
                    }}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={siteSettings.hero_title}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={siteSettings.hero_subtitle}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_subtitle: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Title Size (px)</label>
                  <input
                    type="number"
                    value={siteSettings.hero_title_size || 48}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_title_size: parseInt(e.target.value) || 48})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Title Font</label>
                  <select
                    value={siteSettings.hero_title_font || 'inherit'}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_title_font: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="inherit">Default</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Helvetica', sans-serif">Helvetica</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Verdana', sans-serif">Verdana</option>
                    <option value="'Impact', sans-serif">Impact</option>
                    <option value="'Palatino', serif">Palatino</option>
                    <option value="'Garamond', serif">Garamond</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={siteSettings.hero_button_text || ''}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_button_text: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="Leave empty to hide button"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={siteSettings.hero_button_link || ''}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_button_link: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    placeholder="/products or https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={siteSettings.hero_height || 400}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_height: parseInt(e.target.value) || 400})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Border Radius (px)</label>
                  <input
                    type="number"
                    value={siteSettings.hero_border_radius || 0}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_border_radius: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Overlay Color</label>
                  <input
                    type="color"
                    value={siteSettings.hero_overlay_color || '#000000'}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_overlay_color: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Overlay Opacity: {((siteSettings.hero_overlay_opacity || 0.3) * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={siteSettings.hero_overlay_opacity || 0.3}
                  onChange={(e) => setSiteSettings({...siteSettings, hero_overlay_opacity: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!siteSettings.hero_overlay_enabled}
                    onChange={(e) => setSiteSettings({...siteSettings, hero_overlay_enabled: e.target.checked})}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-medium">Enable Overlay</span>
                </label>
              </div>

              <button
                onClick={saveSiteSettings}
                className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                Save Hero Settings
              </button>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">Layout Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Homepage Product Limit</label>
                <select
                  value={siteSettings.homepage_product_limit || 8}
                  onChange={(e) => setSiteSettings({...siteSettings, homepage_product_limit: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="4">4 products</option>
                  <option value="8">8 products</option>
                  <option value="12">12 products</option>
                  <option value="16">16 products</option>
                  <option value="24">24 products</option>
                  <option value="9999">All products</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Grid Columns</label>
                <select
                  value={siteSettings.product_grid_columns || 4}
                  onChange={(e) => setSiteSettings({...siteSettings, product_grid_columns: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns</option>
                  <option value="4">4 Columns</option>
                  <option value="5">5 Columns</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Card Style</label>
                <select
                  value={siteSettings.product_card_style || 'minimal'}
                  onChange={(e) => setSiteSettings({...siteSettings, product_card_style: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="minimal">Minimal</option>
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                  <option value="overlay">Overlay</option>
                  <option value="bordered">Bordered</option>
                  <option value="shadow">Shadow</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Card Height</label>
                <select
                  value={siteSettings.product_card_height || 'square'}
                  onChange={(e) => setSiteSettings({...siteSettings, product_card_height: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="square">Square (1:1)</option>
                  <option value="portrait">Portrait (3:4)</option>
                  <option value="instagram">Instagram Portrait (4:5)</option>
                  <option value="landscape">Landscape (4:3)</option>
                  <option value="tall">Tall (2:3)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Badge Color</label>
                <input
                  type="color"
                  value={siteSettings.price_badge_color || '#3b82f6'}
                  onChange={(e) => setSiteSettings({...siteSettings, price_badge_color: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Image Zoom</label>
                <select
                  value={siteSettings.product_zoom_type || 'simple'}
                  onChange={(e) => setSiteSettings({...siteSettings, product_zoom_type: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="simple">Simple Zoom (1.05x)</option>
                  <option value="detailed">Detailed Zoom (1.5x)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Page Layout</label>
                <select
                  value={siteSettings.product_page_layout || 'default'}
                  onChange={(e) => setSiteSettings({...siteSettings, product_page_layout: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="default">Default (Split View)</option>
                  <option value="fullscreen">Fullscreen (Slide Left)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Add to Cart Button Text</label>
                <input
                  type="text"
                  value={siteSettings.add_to_cart_button_text || 'Add to Cart'}
                  onChange={(e) => setSiteSettings({...siteSettings, add_to_cart_button_text: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="Add to Cart, Pre-Order, Buy Now, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Header Style</label>
                <select
                  value={siteSettings.header_style}
                  onChange={(e) => setSiteSettings({...siteSettings, header_style: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="minimal">Minimal</option>
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="fashion">Fashion (Black)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Footer Style</label>
                <select
                  value={siteSettings.footer_style}
                  onChange={(e) => setSiteSettings({...siteSettings, footer_style: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="simple">Simple</option>
                  <option value="detailed">Detailed</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Text Size (px)</label>
                  <input
                    type="number"
                    value={siteSettings.footer_text_size || 14}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_text_size: parseInt(e.target.value) || 14})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Logo Size (px)</label>
                  <input
                    type="number"
                    value={siteSettings.footer_logo_size || 32}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_logo_size: parseInt(e.target.value) || 32})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!siteSettings.footer_show_border}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_show_border: e.target.checked})}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-medium">Show Footer Border</span>
                </label>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!siteSettings.footer_show_logo}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_show_logo: e.target.checked})}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="font-medium">Show Logo (instead of title)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Title Height (px)</label>
                  <input
                    type="number"
                    value={siteSettings.footer_title_size || 24}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_title_size: parseInt(e.target.value) || 24})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Title Line Height</label>
                  <input
                    type="number"
                    step="0.1"
                    value={siteSettings.footer_title_line_height || 1.2}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_title_line_height: parseFloat(e.target.value) || 1.2})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Title Weight</label>
                  <select
                    value={siteSettings.footer_title_weight || 600}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_title_weight: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Symbol</label>
                  <select
                    value={siteSettings.footer_symbol || '™'}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_symbol: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="™">™ (Trademark)</option>
                    <option value="®">® (Registered)</option>
                    <option value="©">© (Copyright)</option>
                    <option value="">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Footer Title Font</label>
                  <select
                    value={siteSettings.footer_title_font || 'inherit'}
                    onChange={(e) => setSiteSettings({...siteSettings, footer_title_font: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="inherit">Default</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Helvetica', sans-serif">Helvetica</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="'Verdana', sans-serif">Verdana</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                    <option value="'Impact', sans-serif">Impact</option>
                    <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                    <option value="'Palatino', serif">Palatino</option>
                    <option value="'Garamond', serif">Garamond</option>
                    <option value="'Bookman', serif">Bookman</option>
                    <option value="'Avant Garde', sans-serif">Avant Garde</option>
                    <option value="system-ui">System UI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site Logo</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={siteSettings.site_logo}
                      onChange={(e) => setSiteSettings({...siteSettings, site_logo: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                      placeholder="Logo URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleFileUpload(file, (url) => setSiteSettings({...siteSettings, site_logo: url}))
                        }
                      }}
                      className="p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveSiteSettings}
                className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
              >
                Save Layout Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <h2 className="text-xl font-medium mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-20 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    <option value="USD">$</option>
                    <option value="RWF">RWF</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Sizes (e.g., S,M,L,XL)"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Colors (e.g., Red,Blue,Black)"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  placeholder="Sale End Date"
                  value={formData.sale_end_date}
                  onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <input
                  type="number"
                  placeholder="Viewers Count"
                  value={formData.viewers_count}
                  onChange={(e) => setFormData({ ...formData, viewers_count: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
              </div>
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black h-24"
                required
              />

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">SEO Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">SEO Title ({formData.seo_title.length}/60)</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      maxLength={60}
                      className="w-full p-2 border rounded text-sm"
                      placeholder={`${formData.name} - ${formData.category} | brouna`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Meta Description ({formData.seo_description.length}/160)</label>
                    <textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      maxLength={160}
                      rows={2}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="Shop product at brouna. Premium quality..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Keywords</label>
                    <input
                      type="text"
                      value={formData.seo_keywords}
                      onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                      className="w-full p-2 border rounded text-sm"
                      placeholder="fashion, designer wear, product name"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium">Product Images</label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    + Add Image
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={`image-${index}`} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder={`Image URL ${index + 1}`}
                            value={image}
                            onChange={(e) => updateImageUrl(index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                            required={index === 0}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, (url) => updateImageUrl(index, url))
                            }}
                            className="w-24 p-2 border border-gray-300 rounded text-xs"
                          />
                        </div>
                      </div>
                      
                      {image && (
                        <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop' }}
                          />
                        </div>
                      )}
                      
                      {index > 0 && (
                        <button type="button" onClick={() => removeImageField(index)} className="text-red-500 hover:text-red-700 p-2">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                    setFormData({ name: '', price: '', description: '', category: '', images: [''], stock: '', currency: 'USD', sizes: '', colors: '', sale_end_date: '', viewers_count: '', seo_title: '', seo_description: '', seo_keywords: '' })
                  }}
                  className="flex-1 border border-gray-300 py-3 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}