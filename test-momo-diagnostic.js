const https = require('https');
const http = require('http');

console.log('🔍 MoMo Settings Diagnostic Tool\n');
console.log('=' .repeat(60));

// Step 1: Check if columns exist in database
console.log('\n📋 Step 1: Checking database schema...');
console.log('   Please verify these columns exist in site_settings table:');
console.log('   - payment_paypal_enabled (boolean)');
console.log('   - payment_kpay_enabled (boolean)');
console.log('   - payment_momo_enabled (boolean)');
console.log('   - momo_number (text)');
console.log('   - momo_name (text)');
console.log('   - momo_instructions (text)');
console.log('   - momo_dial_code (text)');
console.log('\n   Run this SQL in Supabase to verify:');
console.log('   SELECT column_name, data_type FROM information_schema.columns');
console.log('   WHERE table_name = \'site_settings\' AND column_name LIKE \'%momo%\';');

// Step 2: Test minimal payload
console.log('\n\n📋 Step 2: Testing with minimal payload...');

const minimalPayload = {
  site_name: "SIZA",
  payment_momo_enabled: true,
  momo_dial_code: "TEST123"
};

function testAPI(payload, testName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 ${testName}`);
    console.log('📤 Payload:', JSON.stringify(payload, null, 2));
    
    const data = JSON.stringify(payload);
    
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
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`📊 Status: ${res.statusCode}`);
          console.log('📥 Response:', JSON.stringify(parsed, null, 2));
          
          if (res.statusCode === 200 && parsed.success) {
            console.log('✅ PASSED');
            resolve(true);
          } else {
            console.log('❌ FAILED:', parsed.error || 'Unknown error');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ FAILED: Could not parse response');
          console.log('Raw response:', responseData);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request Error:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run tests sequentially
async function runTests() {
  try {
    console.log('\n⏳ Starting tests in 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 1: Minimal payload
    const test1 = await testAPI(minimalPayload, 'Test 1: Minimal Payload');
    
    // Test 2: Full payload
    const fullPayload = {
      site_name: "SIZA",
      site_logo: "",
      homepage_product_limit: 8,
      payment_paypal_enabled: true,
      payment_kpay_enabled: true,
      payment_momo_enabled: true,
      momo_number: "0783300000",
      momo_name: "SIZA FURNITURE",
      momo_instructions: "Scan the QR code or tap to dial",
      momo_dial_code: "*182*8*1*{number}*{amount}#"
    };
    
    const test2 = await testAPI(fullPayload, 'Test 2: Full Payload');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Test 1 (Minimal): ${test1 ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Test 2 (Full):    ${test2 ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (!test1 && !test2) {
      console.log('\n💡 TROUBLESHOOTING STEPS:');
      console.log('1. Verify columns exist in database (see Step 1 above)');
      console.log('2. Reload Supabase schema cache:');
      console.log('   - Go to Supabase Dashboard → Settings → API');
      console.log('   - Click "Reload schema cache"');
      console.log('   OR run: NOTIFY pgrst, \'reload schema\';');
      console.log('3. Restart your Next.js dev server');
      console.log('4. Run this test again');
    } else if (test1 || test2) {
      console.log('\n✅ At least one test passed! Schema cache is working.');
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.log('\n💡 Make sure your Next.js dev server is running:');
    console.log('   npm run dev');
  }
}

runTests();
