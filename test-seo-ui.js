const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎯 SIZA SEO TESTER\n');
console.log('='.repeat(60));

function testEndpoint(path, name) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n✅ ${name}`);
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Size: ${data.length} bytes`);
        resolve({ success: res.statusCode === 200, data });
      });
    }).on('error', (err) => {
      console.log(`\n❌ ${name}`);
      console.log(`   Error: ${err.message}`);
      resolve({ success: false });
    });
  });
}

async function addProductSEO() {
  console.log('\n📝 ADD SEO TO PRODUCT\n');
  
  rl.question('Product ID: ', (productId) => {
    rl.question('SEO Title: ', (title) => {
      rl.question('SEO Description: ', (description) => {
        rl.question('SEO Keywords: ', (keywords) => {
          
          const data = JSON.stringify({
            seo_title: title,
            seo_description: description,
            seo_keywords: keywords
          });

          const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/products/${productId}/seo`,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          };

          const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
              if (res.statusCode === 200) {
                console.log('\n✅ SEO Updated Successfully!');
                console.log(JSON.parse(responseData));
              } else {
                console.log('\n❌ Failed to update SEO');
                console.log(`Status: ${res.statusCode}`);
              }
              showMenu();
            });
          });

          req.on('error', (err) => {
            console.log('\n❌ Error:', err.message);
            showMenu();
          });

          req.write(data);
          req.end();
        });
      });
    });
  });
}

function showMenu() {
  console.log('\n' + '='.repeat(60));
  console.log('\nCHOOSE AN OPTION:\n');
  console.log('1. Test Sitemap');
  console.log('2. Test Robots.txt');
  console.log('3. Test Homepage SEO');
  console.log('4. Add SEO to Product');
  console.log('5. Run All Tests');
  console.log('6. Exit\n');
  
  rl.question('Enter option (1-6): ', async (answer) => {
    switch(answer) {
      case '1':
        await testEndpoint('/sitemap.xml', 'Sitemap');
        showMenu();
        break;
      case '2':
        await testEndpoint('/robots.txt', 'Robots.txt');
        showMenu();
        break;
      case '3':
        const home = await testEndpoint('/', 'Homepage');
        if (home.data) {
          const hasTitle = home.data.includes('<title>');
          const hasDesc = home.data.includes('meta name="description"');
          const hasKeywords = home.data.includes('meta name="keywords"');
          console.log(`   Title: ${hasTitle ? '✅' : '❌'}`);
          console.log(`   Description: ${hasDesc ? '✅' : '❌'}`);
          console.log(`   Keywords: ${hasKeywords ? '✅' : '❌'}`);
        }
        showMenu();
        break;
      case '4':
        addProductSEO();
        break;
      case '5':
        console.log('\n🔍 Running All Tests...\n');
        await testEndpoint('/sitemap.xml', 'Sitemap');
        await testEndpoint('/robots.txt', 'Robots.txt');
        await testEndpoint('/', 'Homepage');
        await testEndpoint('/products', 'Products Page');
        console.log('\n✅ All tests complete!');
        showMenu();
        break;
      case '6':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\n❌ Invalid option');
        showMenu();
    }
  });
}

// Start
showMenu();
