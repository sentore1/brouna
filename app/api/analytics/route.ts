import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const text = await request.text()
    if (!text) return NextResponse.json({ success: true })
    
    const body = JSON.parse(text)
    const { type, data } = body

    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop'
    const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other'

    if (type === 'pageview') {
      await supabase.from('page_views').insert({
        page_url: data.url,
        page_title: data.title,
        referrer: data.referrer,
        user_agent: userAgent,
        ip_address: ip,
        device_type: deviceType,
        browser: browser
      })

      // Update session
      if (data.sessionId) {
        const { data: session } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('session_id', data.sessionId)
          .single()

        if (session) {
          await supabase
            .from('user_sessions')
            .update({
              last_page: data.url,
              pages_visited: (session.pages_visited || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('session_id', data.sessionId)
        } else {
          await supabase.from('user_sessions').insert({
            session_id: data.sessionId,
            first_page: data.url,
            last_page: data.url,
            referrer: data.referrer,
            device_type: deviceType
          })
        }
      }
    }

    if (type === 'click') {
      await supabase.from('click_events').insert({
        element_type: data.elementType,
        element_text: data.elementText,
        page_url: data.pageUrl,
        product_id: data.productId,
        user_agent: userAgent,
        ip_address: ip
      })
    }

    if (type === 'cart_add') {
      await supabase.from('cart_events').insert({
        session_id: data.sessionId,
        event_type: 'add',
        product_id: data.productId,
        product_name: data.productName,
        quantity: data.quantity,
        price: data.price
      })
    }

    if (type === 'purchase') {
      await supabase.from('conversion_events').insert({
        session_id: data.sessionId,
        event_type: 'purchase',
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency
      })

      for (const product of data.products || []) {
        await supabase.from('conversion_events').insert({
          session_id: data.sessionId,
          event_type: 'product_purchase',
          product_id: product.id,
          product_name: product.name,
          amount: product.price * product.quantity,
          currency: data.currency
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [pageViews, clicks, sessions, conversions, cartEvents] = await Promise.all([
      supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from('click_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from('user_sessions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from('conversion_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      supabase
        .from('cart_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
    ])

    return NextResponse.json({
      pageViews: pageViews.data || [],
      clicks: clicks.data || [],
      sessions: sessions.data || [],
      conversions: conversions.data || [],
      cartEvents: cartEvents.data || []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
