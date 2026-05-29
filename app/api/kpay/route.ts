import { NextRequest, NextResponse } from 'next/server'
import { KPayService } from '../../../lib/kpay'

const kpayService = new KPayService()

function formatPhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.trim()
  if (cleaned.startsWith('250')) return cleaned
  if (cleaned.startsWith('0')) return `250${cleaned.slice(1)}`
  if (cleaned.startsWith('+250')) return cleaned.slice(1)
  return `250${cleaned}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('KPay API - Received body:', body)
    
    const { 
      msisdn, 
      email, 
      amount, 
      customerName, 
      customerNumber, 
      paymentMethod, 
      bankId,
      orderId 
    } = body

    const paymentData = {
      msisdn: formatPhone(msisdn),
      email,
      details: `Order #${orderId}`,
      refid: `SIZA_${Date.now()}_${orderId}`,
      amount: parseInt(amount),
      currency: 'RWF',
      cname: customerName,
      cnumber: formatPhone(customerNumber),
      pmethod: paymentMethod,
      returl: `${process.env.NEXTAUTH_URL}/api/kpay/webhook`,
      redirecturl: `${process.env.NEXTAUTH_URL}/order-success`,
      bankid: bankId
    }

    console.log('KPay API - Sending payment data:', paymentData)
    const result = await kpayService.initiatePayment(paymentData)
    console.log('KPay API - Received result:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('KPay payment error:', error)
    return NextResponse.json({ 
      success: 0, 
      error: 'Payment initiation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refid = searchParams.get('refid')
    
    if (!refid) {
      return NextResponse.json({ error: 'Reference ID required' }, { status: 400 })
    }

    const result = await kpayService.checkStatus(refid)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('KPay status check error:', error)
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 })
  }
}
