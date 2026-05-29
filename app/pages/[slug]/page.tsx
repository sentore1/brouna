'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function DynamicPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [page, setPage] = useState<{ title: string; content: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('pages')
      .select('title, content')
      .eq('slug', slug)
      .eq('enabled', true)
      .single()
      .then(({ data }) => {
        setPage(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!page) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Page not found.</p>
    </div>
  )

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 w-full min-h-screen">
      <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {page.content}
      </div>
    </main>
  )
}
