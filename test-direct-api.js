const http = require('http');

const testPayload = {
  site_name: "SIZA",
  payment_momo_enabled: true,
  momo_dial_code: "TEST123"
};

console.log('🧪 Testing Direct API Endpoint...\n');
console.log('📤 Payload:', JSON.stringify(testPayload, null, 2));

const data = JSON.stringify(testPayload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/save-settings-direct',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      if (parsed.success) {
        console.log('\n✅ SUCCESS!');
      } else {
        console.log('\n❌ FAILED:', parsed.error);
      }
    } catch (e) {
      console.log('\n❌ Could not parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
