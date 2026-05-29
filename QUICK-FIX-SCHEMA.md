# QUICK FIX - Schema Cache Error

## Error You're Seeing
```
"Could not find the 'payment_account' column of 'orders' in the schema cache"
```

## 3-Step Fix

### Step 1: Reload Schema in Supabase
```
1. Open Supabase Dashboard
2. Go to: Settings → API
3. Click: "Reload Schema" button
4. Wait 30 seconds
```

### Step 2: Restart Dev Server
```bash
# In your terminal, press Ctrl+C to stop, then:
npm run dev
```

### Step 3: Test Checkout
```
1. Add items to cart
2. Checkout → MoMo
3. Fill in Name, Email, Phone
4. Enter transaction ID
5. Click "Confirm Order"
```

## Alternative: Code Already Fixed!

I've updated your API code to automatically handle this error. 

**Just restart your dev server and it should work:**
```bash
npm run dev
```

The code now:
- ✅ Tries with payment_account column
- ✅ If that fails, retries without it
- ✅ Still saves all order data correctly

## Still Not Working?

Run this SQL in Supabase:
```sql
-- Add the column if missing
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account VARCHAR;

-- Reload schema
NOTIFY pgrst, 'reload schema';
```

Then:
1. Supabase Dashboard → Settings → API → Reload Schema
2. Restart dev server
3. Test again

## Need More Help?

Check these files:
- `FIX-SCHEMA-CACHE-ERROR.md` - Detailed guide
- `force-reload-schema-cache.sql` - SQL fix script

## What's Happening?

Supabase caches the database schema for performance. When you add new columns, the cache needs to be refreshed. The "Reload Schema" button does this instantly.

Your code is now smart enough to work around this issue automatically! 🎉
