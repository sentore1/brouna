require('dotenv').config({ path: '.env.local' })

class PayPalService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET
    this.baseUrl = 'https://api-m.sandbox.paypal.com'
  }

  async getAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })
    
    const data = await response.json()
    return data.access_token
  }

  async createOrder(amount) {
    const accessToken = await this.getAccessToken()
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toString()
          }
        }]
      })
    })
    
    return response.json()
  }
}

async function testPayPal() {
  try {
    console.log('Testing PayPal credentials...')
    console.log('Client ID:', process.env.PAYPAL_CLIENT_ID ? 'Set' : 'Missing')
    console.log('Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? 'Set' : 'Missing')
    
    const paypal = new PayPalService()
    const order = await paypal.createOrder(10)
    
    if (order.id) {
      console.log('✅ PayPal integration working')
      console.log('Order ID:', order.id)
    } else {
      console.log('❌ Order creation failed:', order)
    }
  } catch (error) {
    console.error('❌ PayPal test failed:', error.message)
  }
}

testPayPal()