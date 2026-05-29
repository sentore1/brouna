'use client'

import { useState } from 'react'

interface SEOEditorProps {
  productId: string
  initialData?: {
    seo_title?: string
    seo_description?: string
    seo_keywords?: string
  }
}

export default function SEOEditor({ productId, initialData }: SEOEditorProps) {
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '')
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seo_keywords || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/products/${productId}/seo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
        }),
      })
      alert('SEO updated successfully!')
    } catch (error) {
      alert('Failed to update SEO')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            SEO Title ({seoTitle.length}/60)
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={60}
            className="w-full border rounded px-3 py-2"
            placeholder="Product Name - Luxury Fashion | SIZA"
          />
          <p className="text-xs text-gray-500 mt-1">Optimal: 50-60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Meta Description ({seoDescription.length}/160)
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Shop [product] at SIZA. Premium quality [category] crafted for discerning fashion enthusiasts."
          />
          <p className="text-xs text-gray-500 mt-1">Optimal: 150-160 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Keywords (comma-separated)
          </label>
          <textarea
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
            placeholder="luxury fashion, designer wear, high-end clothing, product name"
          />
          <p className="text-xs text-gray-500 mt-1">5-10 relevant keywords</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="text-sm font-semibold mb-2">Search Preview</h4>
        <div className="text-blue-600 text-lg">{seoTitle || 'Product Title'}</div>
        <div className="text-green-700 text-xs">SIZA.com › products › product-name</div>
        <div className="text-sm text-gray-600 mt-1">{seoDescription || 'Product description...'}</div>
      </div>
    </div>
  )
}
