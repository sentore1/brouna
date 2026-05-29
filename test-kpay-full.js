// KPay Full Integration Test - Mobile Money & Card
// Run this with: node test-kpay-full.js

const fetch = require('node-fetch');

const KPAY_USERNAME = 'pryo';
const KPAY_PASSWORD = '6Laa5w';
const KPAY_RETAILER_ID = '01';
const KPAY_BASE_URL = 'https://pay.esicia.com';

function getAuthHeader() {
  const credentials = Buffer.from(`${KPAY_USERNAME}:${KPAY_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

async function testMobileMoneyPayment() {
  console.log('\n=== Testing Mobile Money Payment ===');
  
  const testPaymentData = {
    msisdn: '0783300000',
    email: 'test@SIZA.com',
    details: 'Test Order - Mobile Money',
    refid: `SIZA_MOMO_${Date.now()}`,
    amount: 70000,
    currency: 'RWF',
    cname: 'Test Customer',
    cnumber: '0783300000',
    pmethod: 'momo',
    retailerid: KPAY_RETAILER_ID,
    returl: 'http://localhost:3000/api/kpay/webhook',
    redirecturl: 'http://localhost:3000/order-success',
    bankid: '63510', // MTN Mobile Money
    action: 'pay'
  };

  try {
    const response = await fetch(KPAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify(testPaymentData)
    });

    const result = await response.json();
    
    console.log('Mobile Money Response:', JSON.stringify(result, null, 2));
    
    if (result.success === 1) {
      console.log('✅ Mobile Money payment initiated successfully!');
      console.log('   Transaction ID:', result.tid);
      console.log('   Reference ID:', result.refid);
      console.log('   Return Code:', result.retcode);
    } else {
      console.log('❌ Mobile Money payment failed');
      console.log('   Error:', result.reply || 'Unknown error');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Mobile Money test error:', error.message);
    return null;
  }
}

async function testCardPayment() {
  console.log('\n=== Testing Card Payment ===');
  
  const testPaymentData = {
    msisdn: '0783300000',
    email: 'test@SIZA.com',
    details: 'Test Order - Card Payment',
    refid: `SIZA_CARD_${Date.now()}`,
    amount: 70000,
    currency: 'RWF',
    cname: 'Test Customer',
    cnumber: '0783300000',
    pmethod: 'cc',
    retailerid: KPAY_RETAILER_ID,
    returl: 'http://localhost:3000/api/kpay/webhook',
    redirecturl: 'http://localhost:3000/order-success',
    bankid: '000', // Visa/Mastercard
    action: 'pay'
  };

  try {
    const response = await fetch(KPAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify(testPaymentData)
    });

    const result = await response.json();
    
    console.log('Card Payment Response:', JSON.stringify(result, null, 2));
    
    if (result.success === 1) {
      console.log('✅ Card payment initiated successfully!');
      console.log('   Transaction ID:', result.tid);
      console.log('   Reference ID:', result.refid);
      console.log('   Payment URL:', result.url);
      console.log('   Return Code:', result.retcode);
    } else {
      console.log('❌ Card payment failed');
      console.log('   Error:', result.reply || 'Unknown error');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Card payment test error:', error.message);
    return null;
  }
}

async function testAirtelMoney() {
  console.log('\n=== Testing Airtel Money Payment ===');
  
  const testPaymentData = {
    msisdn: '0783300000',
    email: 'test@SIZA.com',
    details: 'Test Order - Airtel Money',
    refid: `SIZA_AIRTEL_${Date.now()}`,
    amount: 70000,
    currency: 'RWF',
    cname: 'Test Customer',
    cnumber: '0783300000',
    pmethod: 'momo',
    retailerid: KPAY_RETAILER_ID,
    returl: 'http://localhost:3000/api/kpay/webhook',
    redirecturl: 'http://localhost:3000/order-success',
    bankid: '63514', // Airtel Money
    action: 'pay'
  };

  try {
    const response = await fetch(KPAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader()
      },
      body: JSON.stringify(testPaymentData)
    });

    const result = await response.json();
    
    console.log('Airtel Money Response:', JSON.stringify(result, null, 2));
    
    if (result.success === 1) {
      console.log('✅ Airtel Money payment initiated successfully!');
      console.log('   Transaction ID:', result.tid);
      console.log('   Reference ID:', result.refid);
    } else {
      console.log('❌ Airtel Money payment failed');
      console.log('   Error:', result.reply || 'Unknown error');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Airtel Money test error:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   KPay Integration Test - All Payment Methods ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\nConfiguration:');
  console.log('- Base URL:', KPAY_BASE_URL);
  console.log('- Username:', KPAY_USERNAME);
  console.log('- Retailer ID:', KPAY_RETAILER_ID);
  
  await testMobileMoneyPayment();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  await testAirtelMoney();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
  
  await testCardPayment();
  
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║              Test Summary                      ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('All payment methods have been tested.');
  console.log('Check the responses above for details.\n');
}

runAllTests();