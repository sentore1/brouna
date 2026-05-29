'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '../lib/currency'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  currency?: string
  slug?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setLoading(true)
    router.push(`/products/${product.slug || product.id}`)
  }

  const isValidImageUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const imageUrl = isValidImageUrl(product.image) && !imageError
    ? product.image
    : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="bg-white overflow-hidden transition-transform group-hover:scale-105 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-black mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-black font-light">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </div>
    </div>
  )
}
