# 👤 Admin User Setup Guide

## Creating the Admin User: Walid

### Method 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard

2. **Navigate to Authentication**
   - Click **"Authentication"** in the left sidebar
   - Click **"Users"** tab

3. **Add New User**
   - Click **"Add user"** button
   - Choose **"Create new user"**

4. **Enter User Details**
   ```
   Email: walid@autoecole-admin.com
   Password: FADIL123@++
   ```
   - Check **"Auto Confirm User"** (important!)
   - Click **"Create user"**

5. **Done!** ✅
   - The admin user is now created

### Method 2: Via SQL (Alternative)

If you prefer SQL, run this in **SQL Editor**:

```sql
-- This creates a user programmatically
-- Note: Replace the encrypted password with actual hash
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'walid@autoecole-admin.com',
  crypt('FADIL123@++', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Walid"}',
  false
);
```

**Note**: Method 1 is easier and recommended!

## 🔐 Login to Admin Panel

1. **Go to Login Page**
   - Visit `http://localhost:3000/admin/login`

2. **Enter Credentials**
   ```
   Username: Walid
   Password: FADIL123@++
   ```

**Note:** Admin login uses username (not email). Behind the scenes, "Walid" maps to walid@autoecole-admin.com in Supabase.

3. **Access Admin Panel**
   - After login, go to `http://localhost:3000/admin`
   - You should see the admin dashboard! 🎉

## 📸 Image Upload Setup

### Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
2. **Click "Storage"** in the left sidebar
3. **Click "New bucket"**
   - Name: `blog-images`
   - Public bucket: **Yes** ✅
   - Click **"Create bucket"**

### Step 2: Set Storage Policies

Run this SQL in **SQL Editor**:

```sql
-- Allow public access to read images
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
```

Or just run the entire file: `supabase/storage_setup.sql`

### Step 3: Test Image Upload

1. **Login to Admin** (`/admin`)
2. **Go to "Articles" tab**
3. **Click "Nouvel Article"**
4. **Upload an image:**
   - Click the image upload area
   - Select an image (PNG, JPG, GIF up to 5MB)
   - Image will upload automatically
   - Preview appears instantly

## ✨ Image Upload Features

### In Article Editor:
- ✅ **Drag & drop** or click to upload
- ✅ **Preview** before saving
- ✅ **Remove** and replace images
- ✅ **Automatic compression** for web
- ✅ **Unique filenames** to avoid conflicts
- ✅ **File validation** (type & size)

### Supported Formats:
- PNG
- JPG/JPEG
- GIF
- WEBP
- Maximum size: **20 MB** (for high-quality images)

### File Naming:
Images are automatically renamed to avoid conflicts:
```
Format: {timestamp}-{random}.{extension}
Example: 1699123456789-a7k3f9.jpg
```

## 🎨 How to Use Images in Articles

### Option 1: Featured Image (Recommended)
1. Upload image using the image uploader in article editor
2. Image appears at the top of the article automatically
3. Shows on blog listing page
4. Shows on homepage preview

### Option 2: Images in Content
You can also add images in the HTML content:
```html
<img src="https://your-image-url.jpg" alt="Description" />
```

## 📁 Storage Structure

```
supabase-storage/
└── blog-images/
    ├── 1699123456789-a7k3f9.jpg
    ├── 1699123457890-b8m4g0.png
    └── 1699123458901-c9n5h1.gif
```

## 🔒 Security

### Access Control:
- **Public Read**: Anyone can view images
- **Authenticated Write**: Only logged-in users can upload
- **Admin Only**: Only admin can create/edit articles

### File Validation:
- ✅ Type check (only images)
- ✅ Size limit (5 MB max)
- ✅ Automatic sanitization
- ✅ Unique filenames

## 🐛 Troubleshooting

### Image Upload Fails:
1. **Check bucket exists**
   - Go to Storage → Verify `blog-images` bucket
2. **Check policies**
   - Run storage_setup.sql again
3. **Check file size**
   - Must be under 5 MB
4. **Check file type**
   - Must be image/* format

### Images Not Displaying:
1. **Check Next.js config**
   - Verify `*.supabase.co` in image domains
2. **Check image URL**
   - Must be public Supabase URL
3. **Restart dev server**
   - Stop and run `npm run dev` again

### Cannot Upload:
1. **Check authentication**
   - Make sure you're logged in
2. **Check browser console**
   - Look for error messages
3. **Check Supabase logs**
   - Go to Dashboard → Logs

## 📝 Quick Workflow

### Creating an Article with Image:

1. **Login** as Walid (`walid@autoecole-admin.com`)
2. **Go to Admin** (`/admin`)
3. **Click "Articles"** tab
4. **Click "Nouvel Article"**
5. **Enter title** (slug auto-generates)
6. **Enter excerpt** (summary)
7. **Upload featured image** (click upload area)
8. **Enter content** (HTML)
9. **Select category**
10. **Add tags**
11. **Check "Publier"**
12. **Check "Article vedette"** (for homepage)
13. **Fill SEO fields** (title & description)
14. **Click "Enregistrer"** ✅

### Article is now live! 🎉

## 🎓 Tips for Best Results

### Image Optimization:
- Use compressed images (tools: TinyPNG, Squoosh)
- Recommended size: 1200x800px for featured images
- Keep file size under 500KB for best performance

### SEO Best Practices:
- Always add alt text to images
- Use descriptive filenames
- Optimize image dimensions

### Content Tips:
- Featured image shows on listing & detail pages
- Use high-quality, relevant images
- Ensure images are licensed for use

## 🚀 Next Steps

After setup:
1. ✅ Create admin user (Walid)
2. ✅ Create storage bucket
3. ✅ Set storage policies
4. ✅ Test image upload
5. ✅ Create first article with image
6. ✅ Publish and verify on blog page

Everything is ready to use! 📸✨

