-- CHECK FOR PROBLEMATIC TRIGGERS
-- This might be causing the "Database error querying schema" issue

-- ===========================================
-- STEP 1: List all triggers on auth.users
-- ===========================================
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgtype,
  tgenabled,
  proname as function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'auth.users'::regclass
  AND tgname NOT LIKE 'RI_%'  -- Exclude foreign key triggers
ORDER BY tgname;

-- ===========================================
-- STEP 2: Check for custom functions that might be called
-- ===========================================
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (
    p.proname LIKE '%user%' 
    OR p.proname LIKE '%profile%'
    OR p.proname LIKE '%auth%'
  );

-- ===========================================
-- STEP 3: DROP ANY PROBLEMATIC TRIGGERS
-- ===========================================
-- Uncomment these if you see triggers that might be causing issues:

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
-- DROP TRIGGER IF EXISTS tr_check_profile_on_user_creation ON auth.users;

-- ===========================================
-- STEP 4: Check if there are any functions trying to access profiles during auth
-- ===========================================
-- If you see a function that creates profiles automatically, drop it:

-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- ===========================================
-- STEP 5: Test a simple login without triggers
-- ===========================================
-- Try to authenticate directly
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as is_confirmed
FROM auth.users
WHERE email = 'walid@autoecole-admin.com';

-- If the user exists and has password + confirmed, the issue is likely a trigger


