// Force reload Supabase schema cache via API
// Run with: node force-reload-supabase.js

const fetch = require('node-fetch');

const SUPABASE_URL = 'https://poozdevglimtoiakkndz.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb3pkZXZnbGltdG9pYWtrbmR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzAyNDM4NCwiZXhwIjoyMDgyNjAwMzg0fQ.89G7-q3DEDFBzf11dax8m4ysEhGS1cEA_A3ogVYkNoY';

async function reloadSchema() {
  console.log('Attempting to reload Supabase schema cache...\n');

  // Method 1: Send NOTIFY via SQL
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql_query: "NOTIFY pgrst, 'reload schema'; NOTIFY pgrst, 'reload config';"
      })
    });

    console.log('Method 1 (SQL NOTIFY) status:', response.status);
  } catch (error) {
    console.log('Method 1 failed:', error.message);
  }

  // Method 2: Query the schema to force cache refresh
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      }
    });

    console.log('Method 2 (Query orders) status:', response.status);
  } catch (error) {
    console.log('Method 2 failed:', error.message);
  }

  console.log('\nSchema reload attempted.');
  console.log('Wait 30 seconds, then restart your dev server.');
  console.log('\nIf this doesn\'t work, you MUST manually reload in Supabase Dashboard:');
  console.log('Settings → API → Reload Schema button');
}

reloadSchema();
