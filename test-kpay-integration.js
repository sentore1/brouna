const KPAY_USERNAME = 'pryo';
const KPAY_PASSWORD = '6Laa5w';
const KPAY_RETAILER_ID = '01';
const KPAY_BASE_URL = 'https://pay.esicia.com';

function getAuthHeader() {
  const credentials = Buffer.from(`${KPAY_USERNAME}:${KPAY_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
}

async function testWithPhoneConversion() {
  console.log('\n=== Testing with Phone Number Conversion (0783300000 -> 250783300000) ===');
  
  const phoneInput = '0783300000';
  const convertedPhone = phoneInput.startsWith('0') ? `250${phoneInput.slice(1)}` : phoneInput;
  
  console.log('Original phone:', phoneInput);
  console.log('Converted phone:', convertedPhone);
  
  const testPaymentData = {
    msisdn: convertedPhone,
    email: 'abdousentore@gmail.com',
    details: 'Test Order - Phone Conversion',
    refid: `SIZA_TEST_${Date.now()}`,
    amount: 70000,
    currency: 'RWF',
    cname: 'sentore',
    cnumber: convertedPhone,
    pmethod: 'momo',
    retailerid: KPAY_RETAILER_ID,
    returl: 'http://localhost:3000/api/kpay/webhook',
    redirecturl: 'http://localhost:3000/order-success',
    bankid: '63510',
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
    
    console.log('\nResponse:', JSON.stringify(result, null, 2));
    
    if (result.success === 1) {
      console.log('\n✅ Payment initiated successfully!');
      console.log('   Transaction ID:', result.tid);
      console.log('   Reference ID:', result.refid);
      console.log('   Return Code:', result.retcode);
    } else {
      console.log('\n❌ Payment failed');
      console.log('   Error:', result.reply || 'Unknown error');
      console.log('   Return Code:', result.retcode);
    }
    
    return result;
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    return null;
  }
}

testWithPhoneConversion();