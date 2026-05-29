const { PayPalService } = require('./lib/paypal.ts')

async function testPayPal() {
  try {
    const paypal = new PayPalService()
    console.log('Testing PayPal order creation...')
    
    const order = await paypal.createOrder(10)
    console.log('Order created successfully:', order)
    
    if (order.id) {
      console.log('✅ PayPal integration working')
      console.log('Order ID:', order.id)
      console.log('Approval URL:', order.links?.find(link => link.rel === 'approve')?.href)
    } else {
      console.log('❌ Order creation failed:', order)
    }
  } catch (error) {
    console.error('❌ PayPal test failed:', error.message)
  }
}

testPayPal()