# 🔐 Admin Access Guide - Quick Start

## 👤 Admin Credentials

```
Username: Walid
Password: FADIL123@++
```

**Note:** The system uses "Walid" as username (not email) for admin login.

## 🚀 Admin Login

### Method 1: Direct URL (Recommended)
Simply go to:
```
http://localhost:3000/admin/login
```

### Method 2: Via Admin Panel
1. Try to access `/admin`
2. You'll be automatically redirected to `/admin/login`

## ✅ What's Been Created

### 1. **Separate Admin Login Page** (`/admin/login`)
- **No Signup** - Login only (no registration form)
- **Clean Interface** - Just email & password
- **Secure** - Separate from regular user auth
- **Professional** - Dark admin theme

### 2. **Regular User Auth** (`/auth`)
- **Cleaned Up** - Removed terms & conditions
- **Simplified** - Removed "Pourquoi créer un compte?" section
- **User-Friendly** - Login & Signup tabs for regular users

### 3. **Protected Admin Panel** (`/admin`)
- Auto-redirects to `/admin/login` if not logged in
- Full admin dashboard after login
- Article management
- Reservation management

## 📋 Setup Steps

### Step 1: Create Admin User in Supabase

**Via Supabase Dashboard (Easy):**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"Authentication"** → **"Users"**
4. Click **"Add user"** → **"Create new user"**
5. Enter:
   - Email: `walid@autoecole-admin.com`
   - Password: `FADIL123@++`
6. ✅ Check **"Auto Confirm User"**
7. Click **"Create user"**

### Step 2: Create Storage Bucket for Images

1. In Supabase Dashboard → **"Storage"**
2. Click **"New bucket"**
3. Name: `blog-images`
4. Public: **Yes** ✅
5. Click **"Create bucket"**

### Step 3: Set Storage Permissions

In Supabase **SQL Editor**, run:
```sql
-- Allow public read
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow authenticated upload
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated update
CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Allow authenticated delete
CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
```

Or simply run the entire file: `supabase/storage_setup.sql`

## 🎯 Admin Workflow

### First Time Login:
1. Go to `http://localhost:3000/admin/login`
2. Enter credentials:
   - Username: `Walid`
   - Password: `FADIL123@++`
3. Click **"Se connecter"**
4. You're in! 🎉

### Create Your First Article:
1. In Admin Dashboard, click **"Articles"**
2. Click **"Nouvel Article"**
3. Fill in:
   - **Title** (slug auto-generates)
   - **Excerpt** (short description)
   - **Upload Image** (click to upload)
   - **Content** (HTML)
   - **Category** (dropdown)
   - **Tags** (add keywords)
   - **SEO fields** (title & description)
4. Check **"Publier"** to make it live
5. Check **"Article vedette"** for homepage
6. Click **"Enregistrer"**

### Manage Reservations:
1. Click **"Réservations"** tab
2. See all bookings with filters
3. Actions available:
   - **Confirm** pending reservations
   - **Cancel** reservations
   - **Mark as completed**
4. View user details & contact info

## 🎨 Admin Features

### Dashboard Tab:
- 📊 Statistics overview
- 📅 Recent reservations
- 📰 Popular articles
- 📈 Quiz completions

### Articles Tab:
- ✍️ Create new articles
- ✏️ Edit existing articles
- 🗑️ Delete articles
- 👁️ Toggle publish status
- ⭐ Mark as featured
- 🔍 Search articles
- 🏷️ Filter by status

### Réservations Tab:
- 📋 View all bookings
- ✅ Confirm pending
- ❌ Cancel bookings
- ✔️ Mark completed
- 🔍 Search by name
- 🏷️ Filter by status

## 🖼️ Image Upload

### When Creating/Editing Article:
1. Look for **"Image à la une"** section
2. Click the upload area
3. Select image (PNG, JPG, GIF up to 5MB)
4. Image uploads instantly
5. Preview appears automatically
6. Click X to remove/replace

### Image Features:
- ✅ Automatic upload to Supabase Storage
- ✅ Unique filenames (no conflicts)
- ✅ File validation (type & size)
- ✅ Public URLs generated
- ✅ Displays on blog listings
- ✅ Shows on homepage

## 🔐 Security

### Admin Access:
- ✅ Separate login page
- ✅ No public signup
- ✅ Password protected
- ✅ Session-based auth

### Data Protection:
- ✅ RLS (Row Level Security)
- ✅ Only admin can create/edit/delete
- ✅ Public can only read published content
- ✅ Automatic user ID tracking

## 🌐 URLs Reference

```
Regular Users:
/auth               - User login/signup
/dashboard          - User dashboard (with quiz)
/blog               - Public blog listing
/blog/[slug]        - Individual blog post

Admin:
/admin/login        - Admin login (separate)
/admin              - Admin dashboard
  ↳ Dashboard tab   - Statistics
  ↳ Articles tab    - Blog management
  ↳ Réservations    - Booking management
  ↳ Users tab       - Coming soon
  ↳ Settings tab    - Coming soon
```

## 💡 Tips & Best Practices

### For Articles:
1. **Always add an image** - Better engagement
2. **Write SEO title & description** - Better Google ranking
3. **Use proper HTML** - `<h2>` for titles, `<p>` for text
4. **Add tags** - Helps categorization
5. **Mark as featured** - Shows on homepage

### For SEO:
- Title: 50-60 characters
- Description: 150-160 characters
- Keywords: 5-10 relevant terms
- Use clear, descriptive slugs

### For Images:
- Compress before upload (under 500KB best)
- Use 1200x800px for featured images
- Use descriptive alt text
- Ensure proper licensing

## 🐛 Troubleshooting

### Can't Login:
1. Verify user exists in Supabase
2. Check email/password are correct
3. Ensure user is confirmed
4. Clear browser cache

### Images Not Uploading:
1. Check storage bucket exists
2. Verify policies are set
3. Check file size (max 5MB)
4. Ensure file is an image

### Articles Not Showing:
1. Check "Publier" is checked
2. Verify published_at date is set
3. Clear browser cache
4. Check RLS policies

## 📚 Quick Reference

### Admin Credentials:
```
URL: http://localhost:3000/admin/login
Username: Walid
Password: FADIL123@++
```

### Common Actions:
```
Create Article:  Admin → Articles → Nouvel Article
Edit Article:    Click pencil icon on article row
Delete Article:  Click trash icon (confirms first)
Toggle Publish:  Click eye icon
Mark Featured:   Click star icon
Manage Booking:  Admin → Réservations → Select action
```

### Files Location:
```
Admin Login:     app/admin/login/page.tsx
Admin Dashboard: components/admin/AdminDashboard.tsx
Article Editor:  components/admin/ArticleEditor.tsx
Storage Setup:   supabase/storage_setup.sql
```

## ✅ Checklist

Before going live, ensure:
- [ ] Admin user created in Supabase
- [ ] Storage bucket created
- [ ] Storage policies set
- [ ] Admin can login
- [ ] Can create article with image
- [ ] Article appears on blog page
- [ ] Can manage reservations
- [ ] Regular users can signup/login
- [ ] Quiz system works

## 🎉 You're All Set!

Everything is ready to use. Just:
1. Create the admin user in Supabase
2. Create the storage bucket
3. Login at `/admin/login`
4. Start managing your content!

For detailed guides, see:
- `ADMIN_USER_SETUP.md` - Detailed user setup
- `COMPLETE_SETUP_GUIDE.md` - Full system guide
- `BLOG_ADMIN_SETUP.md` - Blog-specific guide

Happy managing! 🚀✨

