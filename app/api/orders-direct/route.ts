import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, total, paymentMethod, transactionId, items, status, customerName, customerEmail, customerPhone, shippingAddress, shippingCity, shippingCountry, shippingPostalCode } = body

    console.log('=== DIRECT SQL ORDER API CALLED ===')
    console.log('Transaction ID:', transactionId)
    console.log('Customer:', customerName, customerEmail, customerPhone)
    console.log('Total:', total)

    if (!transactionId || !customerEmail || !customerPhone || !total) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Direct insert bypassing schema cache
    const insertQuery = `
      INSERT INTO orders (
        customer_email, customer_name, customer_phone, total_amount, status,
        payment_transaction_id, payment_reference, payment_account,
        user_id, shipping_address, shipping_city, shipping_country, shipping_postal_code,
        created_at, updated_at
      ) VALUES (
        '${customerEmail}', '${customerName || 'N/A'}', '${customerPhone}', ${total}, '${status || 'pending'}',
        '${transactionId}', '${transactionId}', '${paymentMethod || 'MoMo'}',
        ${userId ? `'${userId}'` : 'NULL'}, ${shippingAddress ? `'${shippingAddress}'` : 'NULL'}, 
        ${shippingCity ? `'${shippingCity}'` : 'NULL'}, '${shippingCountry || 'Rwanda'}', 
        ${shippingPostalCode ? `'${shippingPostalCode}'` : 'NULL'},
        NOW(), NOW()
      ) RETURNING id, customer_name, customer_email, total_amount, payment_transaction_id, status, created_at;
    `

    console.log('Executing SQL:', insertQuery)

    const { data, error } = await supabase.rpc('execute_raw_sql', { sql_query: insertQuery })

    if (error) {
      console.error('SQL error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log('Order saved:', data)
    return NextResponse.json({ success: true, order: data })
  } catch (error: any) {
    console.error('Exception:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
