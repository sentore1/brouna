import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  try {
    const { data, error } = await supabase.from('site_settings').select('*').single()
    if (error) throw error
    
    // Parse MoMo settings from site_logo if stored as JSON
    if (data && data.site_logo && data.site_logo.startsWith('{')) {
      try {
        const parsed = JSON.parse(data.site_logo)
        if (parsed.momo) {
          const res = NextResponse.json({ ...data, ...parsed.momo, site_logo: parsed.logo || '' })
          res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
          return res
        }
      } catch {}
    }
    
    const settings = {
      ...data,
      payment_polar_enabled: data?.payment_polar_enabled ?? false,
      polar_product_id: data?.polar_product_id ?? '',
    }
    
    const res = NextResponse.json(settings)
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    return res
  } catch {
    return NextResponse.json({
      payment_polar_enabled: false,
      polar_product_id: '',
    })
  }
}
