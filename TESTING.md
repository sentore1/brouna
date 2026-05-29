# SIZA Testing & Troubleshooting Guide

## Issue: Products added in admin (port 3001) not visible on landing page

This guide helps you diagnose and fix the issue where products added through the admin panel are not showing up on the main landing page.

## Quick Diagnosis

### 1. Run the Troubleshooting Script
```bash
npm run test:troubleshoot
```
This will check:
- Environment variables
- Database connection
- Table structure
- RLS policies
- API endpoints
- Common issues

### 2. Test Backend Connection
```bash
npm run test:backend
```
This will:
- Test Supabase connection
- Check if products table exists
- Fetch products from database
- Test API endpoint

### 3. Test API with cURL
```bash
npm run test:api
```
Or manually run:
```bash
# Get all products
curl -X GET http://localhost:3000/api/products

# Add a test product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Product\",\"price\":29.99,\"description\":\"Test\",\"category\":\"tops\",\"image\":\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500\",\"stock\":10}"
```

### 4. Test Frontend (Browser Console)
1. Open http://localhost:3000 in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Copy and paste the content of `test-frontend.js`
5. Press Enter to run the test

## Common Issues & Solutions

### Issue 1: Products Table Doesn't Exist
**Symptoms:** API returns empty array, troubleshoot script shows "Products table does not exist"

**Solution:** Run this SQL in your Supabase SQL Editor:
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  images TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
```

### Issue 2: RLS Policies Block Access
**Symptoms:** Database has products but API returns empty array

**Solution:** Check and fix RLS policies in Supabase:
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Create missing policies
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);
```

### Issue 3: Environment Variables Missing
**Symptoms:** Connection errors, "Missing Supabase credentials"

**Solution:** Check your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Issue 4: Port Confusion (3000 vs 3001)
**Symptoms:** Admin works on 3001 but products don't show on 3000

**Explanation:** Both ports should use the same database. The issue is likely:
- Different environment files
- Different database connections
- RLS policy issues

**Solution:**
1. Ensure both use the same `.env.local`
2. Check if admin is actually saving to database
3. Verify API endpoint works on both ports

### Issue 5: CORS or Network Issues
**Symptoms:** Network errors in browser console

**Solution:**
1. Check browser Network tab for failed requests
2. Verify Supabase project is active and accessible
3. Test API endpoints directly with cURL

## Step-by-Step Debugging Process

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run troubleshooting script:**
   ```bash
   npm run test:troubleshoot
   ```

3. **Check admin panel:**
   - Go to http://localhost:3000/admin
   - Add a test product
   - Check browser console for errors

4. **Test API directly:**
   ```bash
   curl http://localhost:3000/api/products
   ```

5. **Check frontend:**
   - Go to http://localhost:3000
   - Open browser console
   - Look for any error messages
   - Run frontend test script

6. **Verify database:**
   - Log into Supabase dashboard
   - Go to Table Editor
   - Check if products table has data
   - Verify RLS policies

## Manual Database Verification

If automated tests don't help, manually check your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to "Table Editor"
3. Look for the "products" table
4. Check if it has data
5. Go to "Authentication" > "Policies"
6. Verify RLS policies for products table

## Files Created for Testing

- `test-backend.js` - Tests database connection and API
- `test-frontend.js` - Tests frontend functionality (run in browser)
- `test-api.bat` - cURL commands to test API endpoints
- `troubleshoot.js` - Comprehensive diagnostic script

## Getting Help

If you're still having issues:

1. Run `npm run test:troubleshoot` and share the output
2. Check browser console for error messages
3. Verify your Supabase project is active
4. Make sure you're using the correct database credentials

The most common cause is RLS (Row Level Security) policies blocking access to the products table.