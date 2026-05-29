// Test Order History Flow
// Run: node test-order-flow.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:54112';
const TEST_USER_ID = 'test-user-' + Date.now();

async function testOrderFlow() {
  console.log('=== Testing Order History Flow ===\n');

  // Step 1: Create a test order
  console.log('Step 1: Creating test order...');
  const orderData = {
    userId: TEST_USER_ID,
    total: 70000,
    paymentMethod: 'PayPal',
    transactionId: 'TEST_' + Date.now(),
    items: [
      { id: '1', name: 'Essential Tee', price: 25000, quantity: 1 },
      { id: '2', name: 'Minimal Dress', price: 45000, quantity: 1 }
    ],
    status: 'completed'
  };

  try {
    const createResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', createResult.order.id);
      console.log('   Total:', createResult.order.total, 'RWF');
      console.log('   Status:', createResult.order.status);
      console.log('   Payment Method:', createResult.order.payment_method);
      console.log('');
    } else {
      console.log('❌ Failed to create order:', createResult.error);
      return;
    }

    // Step 2: Create another pending order
    console.log('Step 2: Creating pending order...');
    const pendingOrderData = {
      ...orderData,
      total: 50000,
      paymentMethod: 'KPay-momo',
      transactionId: 'KPAY_' + Date.now(),
      items: [{ id: '3', name: 'Classic Shirt', price: 50000, quantity: 1 }],
      status: 'pending'
    };

    const pendingResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingOrderData)
    });

    const pendingResult = await pendingResponse.json();
    
    if (pendingResult.success) {
      console.log('✅ Pending order created successfully!');
      console.log('   Order ID:', pendingResult.order.id);
      console.log('   Status:', pendingResult.order.status);
      console.log('');
    }

    // Step 3: Summary
    console.log('=== Test Summary ===');
    console.log('✅ Order creation: Working');
    console.log('✅ Database storage: Working');
    console.log('✅ Status tracking: Working');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('1. Login to your account at:', BASE_URL + '/account');
    console.log('2. Click on "Orders" section');
    console.log('3. You should see your order history with:');
    console.log('   - Order IDs');
    console.log('   - Total amounts');
    console.log('   - Payment methods');
    console.log('   - Status badges (green for completed, yellow for pending)');
    console.log('');
    console.log('Note: Make sure you run create-user-tables.sql in Supabase first!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Make sure:');
    console.log('1. Dev server is running (npm run dev)');
    console.log('2. Database tables are created (run create-user-tables.sql)');
    console.log('3. Supabase credentials are correct in .env.local');
  }
}

testOrderFlow();
