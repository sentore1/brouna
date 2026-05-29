const https = require('https');
const http = require('http');

const testPayload = {
  site_name: "SIZA",
  site_logo: "",
  homepage_product_limit: 8,
  payment_paypal_enabled: true,
  payment_kpay_enabled: true,
  payment_momo_enabled: true,
  momo_number: "0783300000",
  momo_name: "SIZA FURNITURE",
  momo_instructions: "Scan the QR code or tap to dial, then enter your transaction ID.",
  momo_dial_code: "*182*8*1*{number}*{amount}#"
};

console.log('🧪 Testing MoMo Settings Save API...\n');
console.log('📤 Payload:', JSON.stringify(testPayload, null, 2));
console.log('\n⏳ Sending request to http://localhost:3000/api/save-settings...\n');

const data = JSON.stringify(testPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/save-settings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  console.log('');

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Body:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 200 && parsed.success) {
        console.log('\n✅ SUCCESS! MoMo settings saved successfully!');
      } else {
        console.log('\n❌ FAILED! Error:', parsed.error || 'Unknown error');
      }
    } catch (e) {
      console.log(responseData);
      console.log('\n❌ FAILED! Could not parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.log('\n💡 Make sure your Next.js dev server is running on port 3000');
  console.log('   Run: npm run dev');
});

req.write(data);
req.end();
