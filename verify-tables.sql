-- Run this in Supabase SQL Editor to verify tables exist

-- Check if user_profiles table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'user_profiles'
);

-- Check if orders table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'orders'
);

-- If tables don't exist, run the create-user-tables.sql script first
