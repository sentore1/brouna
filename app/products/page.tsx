'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPriceShort } from '../../lib/currency'

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
  product_grid_columns: number
  product_card_style: string
  product_card_height: string
  price_badge_color: string
  product_zoom_type: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(['all'])
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    product_grid_columns: 4,
    product_card_style: 'minimal',
    product_card_height: 'square',
    price_badge_color: '#3b82f6',
    product_zoom_type: 'simple'
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSiteSettings()
  }, [])

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single()
      if (data && !error) setSiteSettings(data)
    } catch (error) {
      console.log('Using default settings')
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('name').order('name')
      if (data && !error) {
        setCategories(['all', ...data.map(c => c.name)])
      }
    } catch (error) {
      console.log('Using default categories')
    }
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

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-light text-center mb-16 tracking-wide">
          ALL PRODUCTS
        </h1>

        <div className="flex justify-center mb-12">
          <div className="flex space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm tracking-wide uppercase transition-colors ${
                  selectedCategory === category
                    ? 'text-black border-b border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <>
            <style dangerouslySetInnerHTML={{__html: `.product-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}@media (min-width:768px){.product-grid{grid-template-columns:repeat(${siteSettings.product_grid_columns||4},minmax(0,1fr))}}.product-zoom-simple:hover img{transform:scale(1.05)}.product-zoom-detailed:hover img{transform:scale(1.5)}.card-square{aspect-ratio:1/1}.card-portrait{aspect-ratio:3/4}.card-instagram{aspect-ratio:4/5}.card-landscape{aspect-ratio:4/3}.card-tall{aspect-ratio:2/3}`}} />
            <div className="product-grid">
            {filteredProducts.map((product) => (
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
          </>
        )}
      </div>
    </div>
  )
}