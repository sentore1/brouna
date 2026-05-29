import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single()

    const updateData: any = {}
    if (body.site_name !== undefined) updateData.site_name = body.site_name
    if (body.site_logo !== undefined) updateData.site_logo = body.site_logo
    if (body.homepage_product_limit !== undefined) updateData.homepage_product_limit = body.homepage_product_limit
    if (body.payment_paypal_enabled !== undefined) updateData.payment_paypal_enabled = body.payment_paypal_enabled
    if (body.payment_kpay_enabled !== undefined) updateData.payment_kpay_enabled = body.payment_kpay_enabled
    if (body.payment_momo_enabled !== undefined) updateData.payment_momo_enabled = body.payment_momo_enabled
    if (body.momo_number !== undefined) updateData.momo_number = body.momo_number
    if (body.momo_name !== undefined) updateData.momo_name = body.momo_name
    if (body.momo_instructions !== undefined) updateData.momo_instructions = body.momo_instructions
    if (body.momo_dial_code !== undefined) updateData.momo_dial_code = body.momo_dial_code

    if (existing?.id) {
      const { error } = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', existing.id)
      
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert([updateData])
      
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
