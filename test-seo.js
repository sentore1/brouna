// Test SEO Implementation
// Run: node test-seo.js

const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(path, testName) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        console.log(`${success ? '✅' : '❌'} ${testName}`);
        if (success) {
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Size: ${data.length} bytes`);
        } else {
          console.log(`   Error: Status ${res.statusCode}`);
        }
        console.log('');
        resolve({ success, data, status: res.statusCode });
      });
    }).on('error', (err) => {
      console.log(`❌ ${testName}`);
      console.log(`   Error: ${err.message}`);
      console.log('');
      resolve({ success: false, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🔍 Testing SIZA SEO Implementation\n');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: Sitemap
  const sitemap = await testEndpoint('/sitemap.xml', 'Sitemap Generation');
  if (sitemap.success && sitemap.data) {
    const urlCount = (sitemap.data.match(/<url>/g) || []).length;
    console.log(`   Found ${urlCount} URLs in sitemap`);
    console.log('');
  }

  // Test 2: Robots.txt
  const robots = await testEndpoint('/robots.txt', 'Robots.txt');
  if (robots.success && robots.data) {
    const hasSitemap = robots.data.includes('sitemap.xml');
    console.log(`   Sitemap reference: ${hasSitemap ? '✅' : '❌'}`);
    console.log('');
  }

  // Test 3: Homepage
  const home = await testEndpoint('/', 'Homepage SEO');
  if (home.success && home.data) {
    const hasTitle = home.data.includes('<title>');
    const hasDescription = home.data.includes('meta name="description"');
    const hasKeywords = home.data.includes('meta name="keywords"');
    const hasOG = home.data.includes('og:title');
    const hasJsonLd = home.data.includes('application/ld+json');
    
    console.log(`   Title tag: ${hasTitle ? '✅' : '❌'}`);
    console.log(`   Meta description: ${hasDescription ? '✅' : '❌'}`);
    console.log(`   Keywords: ${hasKeywords ? '✅' : '❌'}`);
    console.log(`   OpenGraph: ${hasOG ? '✅' : '❌'}`);
    console.log(`   JSON-LD: ${hasJsonLd ? '✅' : '❌'}`);
    console.log('');
  }

  // Test 4: Products Page
  await testEndpoint('/products', 'Products Page SEO');

  console.log('='.repeat(60));
  console.log('\n📊 SEO Test Summary\n');
  console.log('Next steps:');
  console.log('1. Check browser DevTools for meta tags');
  console.log('2. Test with Google Rich Results Test');
  console.log('3. Validate OpenGraph with Facebook Debugger');
  console.log('4. Submit sitemap to Google Search Console');
  console.log('\n✨ SEO implementation test complete!\n');
}

// Run tests
runTests().catch(console.error);
