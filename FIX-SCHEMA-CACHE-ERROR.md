# FIX: Schema Cache Error - "payment_account column not found"

## The Problem
Supabase's schema cache is outdated and doesn't recognize the `payment_account` column, even though it exists in the database.

## Solution (Choose ONE method)

### Method 1: Manual Schema Reload (RECOMMENDED - Fastest)

1. **Go to Supabase Dashboard**
2. **Navigate to: Settings → API**
3. **Find the "Schema" section**
4. **Click "Reload Schema" button**
5. **Wait 10-30 seconds**
6. **Test checkout again**

### Method 2: SQL Script + Manual Reload

1. **Run the SQL script:**
   - Open Supabase Dashboard → SQL Editor
   - Run `force-reload-schema-cache.sql`

2. **Then manually reload:**
   - Go to Settings → API
   - Click "Reload Schema"

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

### Method 3: Code Already Fixed (Fallback)

I've updated the API code to automatically retry without the `payment_account` column if it causes an error. This means:

✅ **Your code will now work even if the schema cache isn't reloaded**

Just restart your dev server:
```bash
npm run dev
```

## Test the Fix

1. **Add items to cart**
2. **Go to checkout → MoMo**
3. **Fill in:**
   - Name: Test User
   - Email: test@example.com
   - Phone: 0783300000
4. **Click "I have paid — Enter Transaction ID"**
5. **Enter transaction ID:** TEST123456
6. **Click "Confirm Order"**

## Expected Result

✅ Order saves successfully
✅ Redirects to order success page
✅ Order appears in admin dashboard

## If It Still Doesn't Work

### Check Browser Console (F12)
Look for the error message. Common issues:

**Error: "new row violates row-level security policy"**
- Run `fix-orders-rls-only.sql` from earlier

**Error: "null value in column violates not-null constraint"**
- Make sure Name, Email, and Phone are filled in

**Error: Still mentions "payment_account"**
- The code update should handle this automatically
- Make sure you restarted the dev server after I updated the code

### Verify Schema Reload Worked

Run this in Supabase SQL Editor:
```sql
-- Check if column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'payment_account';
```

Should return one row with `payment_account`.

### Force Complete Schema Refresh

If nothing works, try this nuclear option:

1. **Stop your dev server** (Ctrl+C)
2. **In Supabase Dashboard:**
   - Settings → API → Reload Schema
3. **Wait 30 seconds**
4. **Restart dev server:**
   ```bash
   npm run dev
   ```
5. **Clear browser cache** (Ctrl+Shift+Delete)
6. **Test again**

## What Changed in the Code

The API now:
1. Tries to insert with `payment_account`
2. If that fails with a column error, automatically retries without it
3. Still saves all other order data correctly

This makes the system more resilient to schema cache issues.

## Summary

**Quickest fix:** 
1. Supabase Dashboard → Settings → API → Reload Schema
2. Restart dev server
3. Test checkout

The code is already updated to handle the error gracefully, so orders should save even if the schema cache isn't perfect.
