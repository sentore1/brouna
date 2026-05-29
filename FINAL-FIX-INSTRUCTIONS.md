# FINAL FIX - Checkout Order Saving Issue

## Your Current Status
✅ Your orders table has ALL the correct columns
❌ The issue is with RLS (Row Level Security) policies preventing order insertion

## The Fix - Run This SQL Script

**File: `fix-orders-rls-only.sql`**

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `fix-orders-rls-only.sql`
3. Click "Run"

This will:
- Fix RLS policies to allow order creation
- Create order_items table
- Allow service role full access (needed for API)
- Allow anonymous users to create orders (for checkout)

## After Running the SQL

1. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Test the checkout flow:**
   - Add items to cart
   - Go to checkout
   - Select MoMo payment
   - Fill in: Name, Email, Phone (all required!)
   - Click "I have paid — Enter Transaction ID"
   - Enter transaction ID: `TEST123456`
   - Click "Confirm Order"

3. **Check browser console (F12):**
   - Look for "Order save result:" log
   - Should show `success: true`

4. **Check admin dashboard:**
   - Login as admin (sizafurniture@gmail.com)
   - Go to Orders tab
   - Your test order should appear

## What Was Wrong

Your table structure was perfect, but the RLS policies were blocking the API from inserting orders. The service role needs full access to bypass RLS restrictions.

## If It Still Doesn't Work

Open browser DevTools (F12) and check:

1. **Console tab** - Look for error messages
2. **Network tab** - Find the `/api/orders` request
3. **Response** - Check what error is returned

Common errors and fixes:

### Error: "new row violates row-level security policy"
**Fix:** Run the `fix-orders-rls-only.sql` script again

### Error: "null value in column violates not-null constraint"
**Fix:** Make sure you fill in Name, Email, and Phone before clicking "Confirm Order"

### Error: "Failed to save order: [some error]"
**Fix:** Check the Supabase logs:
- Go to Supabase Dashboard
- Click "Logs" in sidebar
- Look for recent errors

## Verify the Fix Worked

Run this query in Supabase SQL Editor to see your orders:

```sql
SELECT 
  id,
  customer_name,
  customer_email,
  customer_phone,
  total_amount,
  payment_transaction_id,
  status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

You should see your test order with the transaction ID you entered.

## Next Steps

Once orders are saving:
1. Test with a real MoMo transaction
2. Verify order appears in admin dashboard
3. Test updating order status from admin panel
4. Clear your test orders if needed:
   ```sql
   DELETE FROM orders WHERE payment_transaction_id LIKE 'TEST%';
   ```
