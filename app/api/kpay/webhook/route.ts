import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tid, refid, statusid, statusdesc, momtransactionid, payaccount } = body

    // Update order status based on payment result
    const isSuccess = statusid === '01'
    const orderStatus = isSuccess ? 'paid' : 'failed'

    // Extract order ID from refid (format: SIZA_timestamp_orderId)
    const orderIdMatch = refid.match(/SIZA_\d+_(.+)/)
    const orderId = orderIdMatch ? orderIdMatch[1] : null

    if (orderId) {
      const { error } = await supabase
        .from('orders')
        .update({
          status: orderStatus,
          payment_reference: tid,
          payment_transaction_id: momtransactionid,
          payment_account: payaccount,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order:', error)
      }
    }

    // Send required response to KPay
    return NextResponse.json({
      tid,
      refid,
      reply: 'OK'
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}