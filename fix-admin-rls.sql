-- Fix RLS Policies for Admin Write Access
-- Run this in your Supabase SQL Editor

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert access" ON products;
DROP POLICY IF EXISTS "Allow public update access" ON products;
DROP POLICY IF EXISTS "Allow public delete access" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Create new permissive policies that allow all operations
CREATE POLICY "Enable all operations for everyone" ON products
    FOR ALL USING (true) WITH CHECK (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'products';

-- Test insert to make sure it works
INSERT INTO products (name, price, image, category, description, stock) 
VALUES ('Test Product', 99.99, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 'test', 'Test product', 1);

-- Clean up test product
DELETE FROM products WHERE name = 'Test Product';