-- Reset admin password to ensure it matches
-- Run this in Supabase SQL Editor

UPDATE auth.users
SET 
  encrypted_password = crypt('FADIL123@++', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'walid@autoecole-admin.com';

-- Verify the update
SELECT 
  email, 
  email_confirmed_at,
  updated_at,
  'Password has been reset to: FADIL123@++' as message
FROM auth.users 
WHERE email = 'walid@autoecole-admin.com';


