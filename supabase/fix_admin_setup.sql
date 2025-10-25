-- Complete Admin Setup Fix
-- Run this in Supabase SQL Editor

-- Step 1: Ensure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create profile for admin user if it doesn't exist
INSERT INTO public.profiles (id, full_name, phone, created_at, updated_at)
SELECT 
  u.id,
  'Walid',
  '+33600000000',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'walid@autoecole-admin.com'
ON CONFLICT (id) DO UPDATE 
SET 
  full_name = 'Walid',
  updated_at = NOW();

-- Step 3: Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Step 5: Verify admin user and profile
SELECT 
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.phone,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Profile exists'
    ELSE '❌ Profile missing'
  END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'walid@autoecole-admin.com';

-- Step 6: Update password (just to be sure)
UPDATE auth.users
SET 
  encrypted_password = crypt('FADIL123@++', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'walid@autoecole-admin.com';

-- Final verification
SELECT '✅ Admin setup complete!' as status;


