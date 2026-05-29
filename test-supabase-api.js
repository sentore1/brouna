// Test what columns Supabase API can see
const fetch = require('node-fetch');

const SUPABASE_URL = 'https://poozdevglimtoiakkndz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3pkZXZnbGltdG9pYWtrbmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzAyNDM4NCwiZXhwIjoyMDgyNjAwMzg0fQ.89G7-q3DEDFBzf11dax8m4ysEhGS1cEA_A3ogVYkNoY';

async function testAPI() {
  console.log('Testing Supabase API schema cache...\n');

  // Try to insert with different column combinations
  const tests = [
    { name: 'Test 1: All columns', data: { customer_email: 'test@test.com', customer_name: 'Test', customer_phone: '123', total_amount: 100, status: 'pending' }},
    { name: 'Test 2: Without total_amount', data: { customer_email: 'test@test.com', customer_name: 'Test', customer_phone: '123', status: 'pending' }},
    { name: 'Test 3: Only email', data: { customer_email: 'test@test.com' }},
  ];

  for (const test of tests) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();
      console.log(`${test.name}:`);
      console.log('Status:', response.status);
      console.log('Result:', JSON.stringify(result, null, 2));
      console.log('---\n');
    } catch (error) {
      console.log(`${test.name} failed:`, error.message);
      console.log('---\n');
    }
  }
}

testAPI();
