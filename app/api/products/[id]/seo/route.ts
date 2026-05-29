import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { seo_title, seo_description, seo_keywords } = body

    const { data, error } = await supabase
      .from('products')
      .update({
        seo_title,
        seo_description,
        seo_keywords,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product SEO' },
      { status: 500 }
    )
  }
}
