-- CHECK SUPABASE AUTH CONFIGURATION
-- Look for any remaining issues

-- ===========================================
-- STEP 1: Verify NO triggers exist
-- ===========================================
SELECT 
  'AUTH TRIGGERS' as check_type,
  tgname as name,
  proname as function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgrelid = 'auth.users'::regclass
  AND tgname NOT LIKE 'RI_%'
ORDER BY tgname;

-- Should be EMPTY!

-- ===========================================
-- STEP 2: Check for hooks on other auth tables
-- ===========================================
SELECT 
  'ALL AUTH TRIGGERS' as check_type,
  t.tgname,
  c.relname as table_name,
  p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE n.nspname = 'auth'
  AND t.tgname NOT LIKE 'RI_%'
ORDER BY c.relname, t.tgname;

-- ===========================================
-- STEP 3: Check auth.users schema permissions
-- ===========================================
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'auth'
  AND table_name = 'users';

-- ===========================================
-- STEP 4: Try manual auth test
-- ===========================================
-- Verify the user can be selected
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  email_confirmed_at IS NOT NULL as is_confirmed,
  role,
  aud
FROM auth.users
WHERE email = 'admin@test.com';

-- ===========================================
-- STEP 5: Check if profiles can be accessed
-- ===========================================
SELECT 
  p.*
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@test.com';

-- ===========================================
-- FINAL CHECK: Grant all necessary permissions
-- ===========================================
-- Ensure authenticated role can access profiles
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;


