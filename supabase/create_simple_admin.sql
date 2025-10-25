-- Create a simple admin user from scratch
-- This is a minimal setup that should work

-- Step 1: Delete old admin user if exists
DELETE FROM auth.users WHERE email = 'admin@autoecole.local';

-- Step 2: Create new admin user
-- Note: You can also do this via Supabase Dashboard > Authentication > Users > Add user
-- Email: admin@autoecole.local
-- Password: Admin123!@#
-- Make sure to check "Auto Confirm User"

-- If using SQL, this creates the user:
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
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
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create profile for the user
  INSERT INTO public.profiles (id, full_name, phone, created_at, updated_at)
  VALUES (new_user_id, 'Admin', '+33600000000', NOW(), NOW());

  RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
END $$;

-- Verify
SELECT 
  u.email,
  u.email_confirmed_at,
  p.full_name,
  'Admin user ready!' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@autoecole.local';


