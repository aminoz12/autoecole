-- UPDATE SUPABASE STORAGE SETTINGS FOR LARGER IMAGES
-- This allows uploading high-quality images up to 20MB

-- Note: Supabase storage limits are configured at the project level
-- To increase file upload size:

-- 1. Go to Supabase Dashboard
-- 2. Click "Storage" in the left sidebar
-- 3. Click on "blog-images" bucket
-- 4. Click "Settings" or "Configuration"
-- 5. Update "Maximum file size" to 20MB (or higher if needed)

-- Alternatively, you can use the Supabase API to update bucket settings
-- But this is typically done via the dashboard for simplicity

-- For now, the frontend validation allows 20MB
-- Make sure your Supabase project storage settings match!

-- Verify current bucket settings
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'blog-images';

-- If you need to update programmatically (requires proper permissions):
-- UPDATE storage.buckets 
-- SET file_size_limit = 20971520  -- 20MB in bytes
-- WHERE name = 'blog-images';


