-- REMOVE PROBLEMATIC TRIGGER
-- This trigger is causing "Database error querying schema" during login

-- Step 1: Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Step 2: Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Verify triggers are gone
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'auth.users'::regclass
  AND tgname NOT LIKE 'RI_%'
ORDER BY tgname;

-- Should return empty result or only system triggers

-- Step 4: Verify admin user is ready
SELECT 
  u.email,
  u.email_confirmed_at as confirmed,
  p.full_name,
  '✅ Ready to login!' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'walid@autoecole-admin.com';

-- Login credentials:
-- Email: walid@autoecole-admin.com
-- Password: FADIL123@++


