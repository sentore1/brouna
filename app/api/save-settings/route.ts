import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get existing settings
    const { data: existing } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 })
    }

    // Merge with existing data
    const merged = { ...existing, ...body }
    delete merged.id
    delete merged.created_at
    delete merged.updated_at

    // Use PostgreSQL REST API directly
    const updateUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_settings?id=eq.${existing.id}`
    
    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(merged)
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
