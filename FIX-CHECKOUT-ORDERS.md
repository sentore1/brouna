# Fix Checkout Transaction ID & Order Saving Issue

## Problem
When customers click "Confirm Order" on the checkout page after entering their MoMo transaction ID, the order is not being saved to the database and doesn't appear in the admin dashboard.

## Root Cause
The `orders` table schema has mismatched column names between what the API expects and what actually exists in the database.

## Solution

### Step 1: Update Database Schema

Run the SQL script `fix-orders-table-schema.sql` in your Supabase SQL Editor:

```bash
# The script will:
# 1. Add missing columns (total_amount, payment_reference, payment_transaction_id, payment_account)
# 2. Create order_items table if it doesn't exist
# 3. Update RLS policies to allow order insertion
# 4. Reload schema cache
```

To run it:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `fix-orders-table-schema.sql`
4. Paste and run it

### Step 2: Verify the Fix

After running the SQL script, test the checkout flow:

1. Add items to cart
2. Go to checkout
3. Select MoMo payment
4. Fill in contact information (name, email, phone)
5. Click "I have paid — Enter Transaction ID"
6. Enter a test transaction ID (e.g., "TEST123456")
7. Click "Confirm Order"

The order should now:
- Save successfully to the database
- Appear in the admin dashboard under Orders
- Show the transaction ID, customer info, and order details

### Step 3: Check Admin Dashboard

1. Log in as admin (sizafurniture@gmail.com)
2. Go to Admin panel
3. Click on "Orders" tab
4. You should see all orders including the new ones with transaction IDs

## What Was Fixed

### API Changes (`app/api/orders/route.ts`)
- Added validation for required fields (transactionId, customerEmail, customerPhone, total)
- Changed order of operations: try direct insert first, then RPC fallback
- Added GET endpoint for fetching orders
- Improved error handling and logging
- Ensured all required fields are passed to database

### Database Schema (`fix-orders-table-schema.sql`)
- Added missing columns to match API expectations
- Created order_items table for storing individual products
- Updated RLS policies to allow anonymous users to create orders
- Added policy for service role to insert orders

### Key Changes
1. **total_amount** column added (API was using this instead of `total`)
2. **payment_transaction_id** column added (API was using this instead of `transaction_id`)
3. **payment_reference** column added for payment tracking
4. **payment_account** column added (API was using this instead of `payment_method`)
5. **RLS policies** updated to allow order creation without authentication

## Testing Checklist

- [ ] Run the SQL migration script
- [ ] Test MoMo checkout flow
- [ ] Verify transaction ID is saved
- [ ] Check order appears in admin dashboard
- [ ] Verify customer information is saved correctly
- [ ] Test order items are linked properly
- [ ] Verify order status can be updated from admin panel

## Troubleshooting

If orders still don't save:

1. Check browser console for errors
2. Check Supabase logs in Dashboard > Logs
3. Verify environment variables are set:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

4. Verify RLS policies allow insertion:
```sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

5. Test direct database insert:
```sql
INSERT INTO orders (
  customer_email, customer_name, customer_phone,
  total_amount, status, payment_transaction_id,
  payment_reference, payment_account
) VALUES (
  'test@example.com', 'Test User', '0783300000',
  100.00, 'pending', 'TEST123',
  'TEST123', 'MoMo'
);
```

## Additional Notes

- Orders are now saved with both `payment_transaction_id` and `payment_reference` set to the transaction ID
- The `payment_account` field stores the payment method (e.g., "MoMo", "KPay", "PayPal")
- Order items are stored in a separate `order_items` table linked by `order_id`
- Admin can view and update order status from the dashboard
