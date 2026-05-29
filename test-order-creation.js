// Test script to verify order creation
// Run with: node test-order-creation.js

const testOrderCreation = async () => {
  const testOrder = {
    userId: null,
    total: 2999999.98,
    paymentMethod: 'MoMo',
    transactionId: 'TEST' + Date.now(),
    items: [
      {
        id: 'test-product-1',
        name: 'Test Product',
        price: 1500000,
        quantity: 2
      }
    ],
    status: 'pending',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '0783300000',
    shippingAddress: 'Test Address',
    shippingCity: 'Kigali',
    shippingCountry: 'Rwanda',
    shippingPostalCode: '00000'
  }

  console.log('Testing order creation...')
  console.log('Transaction ID:', testOrder.transactionId)

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    })

    const result = await response.json()
    
    console.log('\n=== RESPONSE ===')
    console.log('Status:', response.status)
    console.log('Success:', result.success)
    
    if (result.success) {
      console.log('✅ Order created successfully!')
      console.log('Order ID:', result.order?.id)
      console.log('Transaction ID:', result.order?.payment_transaction_id)
    } else {
      console.log('❌ Order creation failed!')
      console.log('Error:', result.error)
    }

    return result
  } catch (error) {
    console.error('❌ Test failed with exception:', error.message)
    return null
  }
}

// Run the test
testOrderCreation()
  .then(() => {
    console.log('\n=== TEST COMPLETE ===')
    console.log('Check your admin dashboard to verify the order appears.')
  })
  .catch(err => {
    console.error('Test error:', err)
  })
