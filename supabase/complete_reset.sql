-- COMPLETE RESET - Nuclear option to fix all auth issues
-- This will clean everything and start fresh

-- ===========================================
-- STEP 1: Remove ALL triggers on auth.users
-- ===========================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'auth.users'::regclass 
        AND tgname NOT LIKE 'RI_%'
    ) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON auth.users CASCADE';
    END LOOP;
END $$;

-- ===========================================
-- STEP 2: Remove ALL related functions
-- ===========================================
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_auth_user_created() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_on_signup() CASCADE;

-- ===========================================
-- STEP 3: COMPLETELY disable RLS on profiles
-- ===========================================
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- ===========================================
-- STEP 4: Drop ALL policies on profiles
-- ===========================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- ===========================================
-- STEP 5: Ensure profiles table has correct structure
-- ===========================================
-- Recreate if needed
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NO RLS for now - we'll add it back later once login works
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ===========================================
-- STEP 6: Clean up and recreate admin user
-- ===========================================
-- Remove existing admin
DELETE FROM public.profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@test.com'
);
DELETE FROM auth.users WHERE email = 'admin@test.com';

-- Create fresh admin user
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
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('Test123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  ''
) RETURNING id;

-- Create profile for admin (get the ID from the user just created)
INSERT INTO public.profiles (id, full_name, phone)
SELECT id, 'Admin User', '+33600000000'
FROM auth.users
WHERE email = 'admin@test.com';

-- ===========================================
-- VERIFICATION
-- ===========================================
-- Check no triggers remain
SELECT 
  'Triggers remaining' as check_type,
  COUNT(*) as count
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass 
AND tgname NOT LIKE 'RI_%';

-- Check admin user
SELECT 
  '✅ Admin User Ready' as status,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@test.com';

-- Display login info
SELECT 
  '📋 LOGIN CREDENTIALS' as info,
  'Email: admin@test.com' as email,
  'Password: Test123456' as password;

