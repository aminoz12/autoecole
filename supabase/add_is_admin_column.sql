-- Add is_admin column to profiles table
-- This will help differentiate admin users from regular subscribers

-- Add the is_admin column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;

-- Add email column to profiles table (for easier admin identification)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster queries on is_admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Update the admin user(s) to have is_admin = true
-- Based on the email in auth.users
UPDATE public.profiles p
SET 
  is_admin = true,
  email = u.email,
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
  AND u.email IN (
    'walid@autoecole-admin.com',
    'admin@autoecole.local',
    'test@admin.com'
  );

-- Verify the changes
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.is_admin,
  u.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;

-- Show count of admin vs regular users
SELECT 
  CASE WHEN is_admin THEN 'Admin' ELSE 'Regular User' END as user_type,
  COUNT(*) as count
FROM public.profiles
GROUP BY is_admin
ORDER BY is_admin DESC;

