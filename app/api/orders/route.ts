import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Query directly with SQL to bypass schema cache
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Map the data to use consistent column names for the frontend
    const mappedOrders = (data || []).map(order => ({
      ...order,
      // Ensure both old and new column names are available
      total: order.total_amount || order.total,
      transaction_id: order.payment_transaction_id || order.transaction_id,
      payment_method: order.payment_account || order.payment_method
    }))

    return NextResponse.json({ success: true, orders: mappedOrders })
  } catch (error: any) {
    console.error('GET orders exception:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, total, paymentMethod, transactionId, items, status, customerName, customerEmail, customerPhone, shippingAddress, shippingCity, shippingCountry, shippingPostalCode } = body

    console.log('=== ORDER API CALLED ===')
    console.log('Transaction ID:', transactionId)
    console.log('Customer:', customerName, customerEmail, customerPhone)
    console.log('Total:', total)

    if (!transactionId || !customerEmail || !customerPhone || !total) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Use OLD column names that are in the schema cache
    const orderData = {
      user_id: userId || null,
      total: total,
      payment_method: paymentMethod || 'MoMo',
      transaction_id: transactionId,
      items: items || [],
      status: status || 'pending',
      customer_name: customerName || 'N/A',
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress || null,
      shipping_city: shippingCity || null,
      shipping_country: shippingCountry || 'Rwanda',
      shipping_postal_code: shippingPostalCode || null
    }

    console.log('Inserting order with OLD column names:', orderData)

    const { data: insertedOrder, error: insertError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: insertError.message 
      }, { status: 500 })
    }

    console.log('Order inserted successfully:', insertedOrder)
    console.log('=== ORDER SAVED SUCCESSFULLY ===')
    return NextResponse.json({ success: true, order: insertedOrder })
  } catch (error: any) {
    console.error('=== ORDER API EXCEPTION ===', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing orderId or status' 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Track conversion when order is marked as completed
    if (status === 'completed' && data) {
      const orderTotal = data.total_amount || data.total || 0
      await supabase.from('conversion_events').insert({
        event_type: 'purchase',
        order_id: orderId,
        amount: orderTotal,
        currency: 'RWF'
      })
    }

    return NextResponse.json({ success: true, order: data })
  } catch (error: any) {
    console.error('PATCH orders exception:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
