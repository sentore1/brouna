# 🔧 SOLUTION: Fix Products Not Showing Issue

## Problem Identified
✅ **Database**: Has 9 products  
❌ **API**: Returns 0 products  
🔍 **Root Cause**: RLS (Row Level Security) policies are blocking access

## Quick Fix (5 minutes)

### Step 1: Fix RLS Policies in Supabase
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `poozdevglimtoiakkndz`
3. Go to **SQL Editor**
4. Copy and paste this SQL:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for users based on email" ON products;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON products;

-- Create new permissive policies
CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON products
    FOR DELETE USING (true);
```

5. Click **Run** to execute the SQL

### Step 2: Test the Fix
Run this command to verify:
```bash
node debug-api.js
```

You should see:
- ✅ Database has X products
- ✅ API returned X products (same number)

### Step 3: Check Your Website
1. Go to http://localhost:3001 (your landing page)
2. You should now see all products displayed
3. Go to http://localhost:3001/admin to manage products

## Alternative Fix (If SQL doesn't work)

If you can't access Supabase SQL Editor, disable RLS temporarily:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

**Warning**: This removes all security. Re-enable it later with proper policies.

## Verification Commands

Test everything is working:

```bash
# Test database connection
node test-simple.js

# Test API vs Database
node debug-api.js

# Test API endpoint directly
curl http://localhost:3001/api/products
```

## Why This Happened

RLS policies were created that blocked anonymous access to the products table. The admin panel and landing page both use the anonymous key to access data, so they were blocked.

## Current Setup Summary

- **Port**: 3001 (both landing page and admin)
- **Landing Page**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin
- **API**: http://localhost:3001/api/products
- **Database**: Supabase (9 products exist)

## Next Steps

1. Fix RLS policies (above)
2. Test that products show on landing page
3. Add more products via admin panel
4. Verify new products appear immediately

The fix should take less than 5 minutes and will immediately resolve the issue!