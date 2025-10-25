-- FIX NULL COLUMNS IN AUTH.USERS
-- The auth service expects empty strings, not NULLs

-- Update ALL admin users to have empty strings instead of NULLs
UPDATE auth.users
SET 
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  updated_at = NOW()
WHERE email IN ('admin@test.com', 'walid@autoecole-admin.com');

-- Verify
SELECT 
  email,
  email_change,
  email_change_token_new,
  confirmation_token,
  '✅ Fixed!' as status
FROM auth.users
WHERE email IN ('admin@test.com', 'walid@autoecole-admin.com');


