-- Check if all required tables exist
SELECT 
  'profiles' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as exists;

SELECT 
  'blog_posts' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'blog_posts'
  ) as exists;

-- Check if profile exists for admin user
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.phone,
  u.email
FROM profiles p
RIGHT JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'walid@autoecole-admin.com';

-- If profile doesn't exist, create it
INSERT INTO profiles (user_id, full_name, phone)
SELECT 
  id,
  'Walid',
  '+33600000000'
FROM auth.users 
WHERE email = 'walid@autoecole-admin.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.users.id
);


