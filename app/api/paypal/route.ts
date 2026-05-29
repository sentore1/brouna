import { NextRequest, NextResponse } from 'next/server'
import { PayPalService } from '../../../lib/paypal'

const paypalService = new PayPalService()

export async function POST(request: NextRequest) {
  try {
    const { action, amount, orderId, currency = 'USD' } = await request.json()

    if (action === 'create') {
      const order = await paypalService.createOrder(parseFloat(amount))
      return NextResponse.json(order)
    }

    if (action === 'capture') {
      const capture = await paypalService.captureOrder(orderId)
      return NextResponse.json(capture)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('PayPal API error:', error)
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
  }
}