// Test what columns Supabase API can see
const SUPABASE_URL = 'https://poozdevglimtoiakkndz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3pkZXZnbGltdG9pYWtrbmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzAyNDM4NCwiZXhwIjoyMDgyNjAwMzg0fQ.89G7-q3DEDFBzf11dax8m4ysEhGS1cEA_A3ogVYkNoY';

async function testAPI() {
  console.log('Testing Supabase API schema cache...\n');

  // Try to get existing orders first
  try {
    console.log('Fetching existing orders...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    const result = await response.json();
    console.log('GET Status:', response.status);
    console.log('Existing orders:', JSON.stringify(result, null, 2));
    console.log('---\n');
  } catch (error) {
    console.log('GET failed:', error.message);
    console.log('---\n');
  }

  // Try minimal insert
  try {
    console.log('Attempting minimal insert...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        customer_email: 'test@test.com',
        customer_name: 'Test User',
        customer_phone: '123456',
        total_amount: 100,
        status: 'pending'
      })
    });

    const result = await response.json();
    console.log('POST Status:', response.status);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('POST failed:', error.message);
  }
}

testAPI();
