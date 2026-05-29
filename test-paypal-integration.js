// PayPal Integration Test Script
// Run this with: node test-paypal-integration.js

const fetch = require('node-fetch');

const PAYPAL_CLIENT_ID = 'AU7UGt9qCUSriw8IqMX772p3uNIhYs54YeJ1Pw4ydY-PlKm8OwOYEzIEpRI_1EiMM4O_3hK-B2SDvQv0';
const PAYPAL_CLIENT_SECRET = 'EDu-HeRneWJ336_pdy-nCRMjQq8q8s5x85oOcfgc1B596UO6B6bnPsa2bBHmdIy3MWSa3NeX_f25ODxQ';
const BASE_URL = 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

async function testPayPalConnection() {
  try {
    console.log('Testing PayPal connection...');
    const accessToken = await getAccessToken();
    console.log('✅ PayPal connection successful!');
    console.log('Access token received:', accessToken.substring(0, 20) + '...');
    
    // Test creating an order
    const orderResponse = await fetch(`${BASE_URL}/v2/checkout/orders`, {
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
            value: '53.85' // 70,000 RWF converted to USD
          }
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
      })
    });
    
    const order = await orderResponse.json();
    if (order.id) {
      console.log('✅ Test order created successfully!');
      console.log('Order ID:', order.id);
      console.log('Order status:', order.status);
    } else {
      console.log('❌ Failed to create test order:', order);
    }
    
  } catch (error) {
    console.error('❌ PayPal test failed:', error.message);
  }
}

testPayPalConnection();