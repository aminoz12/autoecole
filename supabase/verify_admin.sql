-- Check if admin user exists
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'walid@autoecole-admin.com';

-- If no results, the user doesn't exist yet!

