-- DIAGNOSE AND FIX AUTH ISSUES
-- Run this step by step and check results

-- ===========================================
-- STEP 1: Check for problematic triggers
-- ===========================================
SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
ORDER BY event_object_table, trigger_name;

-- ===========================================
-- STEP 2: Drop any custom triggers on auth.users if they exist
-- ===========================================
-- Uncomment if you see triggers in Step 1 that might be causing issues
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS handle_new_user ON auth.users;

-- ===========================================
-- STEP 3: Check if profiles table has correct structure
-- ===========================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ===========================================
-- STEP 4: Temporarily disable RLS on profiles
-- ===========================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ===========================================
-- STEP 5: Check existing policies (for reference)
-- ===========================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- ===========================================
-- STEP 6: Create simple, permissive RLS policies
-- ===========================================
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Create very permissive policies for testing
CREATE POLICY "Allow all authenticated users to read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all authenticated users to insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (true);

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- STEP 7: Ensure admin user exists with profile
-- ===========================================
-- Check if admin exists
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email IN ('admin@autoecole.local', 'walid@autoecole-admin.com');

-- ===========================================
-- STEP 8: Create fresh admin user
-- ===========================================
-- First, clean up
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'admin@autoecole.local'
);

DELETE FROM auth.users WHERE email = 'admin@autoecole.local';

-- Create new admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  recovery_token,
  email_change_token_new
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@autoecole.local',
  crypt('Admin123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin"}',
  '',
  '',
  ''
);

-- Create profile for new admin
INSERT INTO public.profiles (id, full_name, phone)
SELECT id, 'Admin', '+33600000000'
FROM auth.users
WHERE email = 'admin@autoecole.local';

-- ===========================================
-- FINAL VERIFICATION
-- ===========================================
SELECT 
  '✅ Setup complete!' as status,
  u.email,
  u.email_confirmed_at as confirmed,
  p.full_name,
  CASE WHEN p.id IS NOT NULL THEN '✅ Has profile' ELSE '❌ No profile' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@autoecole.local';


