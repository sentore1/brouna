import { NextRequest, NextResponse } from 'next/server'
import { polarApi } from '../../../../lib/polar'
import type { CheckoutCreate } from '@polar-sh/sdk/models/components/checkoutcreate'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', customerEmail, customerName, orderId, productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get customer IP for better currency/country detection
    const customerIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                       request.headers.get('x-real-ip') || 
                       'unknown'

    // Create checkout session with ad-hoc pricing so the actual cart total is charged,
    // not the fixed price set on the product in the Polar dashboard.
    const prices: CheckoutCreate['prices'] = {}
    prices[productId] = [{
      amountType: 'fixed',
      priceAmount: Math.round(amount * 100),
      priceCurrency: (currency as string).toLowerCase() as import('@polar-sh/sdk/models/components/presentmentcurrency').PresentmentCurrency,
    }]

    const checkoutSession = await polarApi.checkouts.create({
      products: [productId],
      prices,
      successUrl: `${process.env.NEXTAUTH_URL}/order-success?checkout_id={CHECKOUT_ID}`,
      customerEmail,
      customerIpAddress: customerIp !== 'unknown' ? customerIp : undefined,
      metadata: {
        orderId,
        customerName,
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      checkoutId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Polar checkout error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
