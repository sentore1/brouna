const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTable() {
  console.log('Creating momo_orders table...')
  
  const { data, error } = await supabase.rpc('exec_raw_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS momo_orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        total_amount NUMERIC,
        status TEXT DEFAULT 'pending',
        transaction_id TEXT,
        payment_method TEXT,
        order_items TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      ALTER TABLE momo_orders ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Allow service role" ON momo_orders;
      CREATE POLICY "Allow service role" ON momo_orders FOR ALL USING (true);
    `
  })

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success:', data)
  }
}

createTable()
