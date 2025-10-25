# 🚀 Deploy AutoEcole to Netlify

## ✅ Pre-Deployment Checklist

Your AutoEcole website uses:
- ✅ Next.js 14 with App Router
- ✅ Supabase (Authentication + Database)
- ✅ Server-side rendering (SSR)
- ✅ Dynamic routes (Blog, Dashboard, Admin)
- ✅ Image uploads to Supabase Storage

## 📋 Step-by-Step Deployment Guide

### 1️⃣ **Prepare Your Supabase Project**

Make sure you have run all the SQL scripts in your Supabase SQL Editor:

1. **Database Schema**: `supabase/blog_schema.sql` ✅
2. **Storage Setup**: `supabase/storage_setup.sql` ✅
3. **Admin Setup**: `supabase/complete_admin_setup.sql` ✅
4. **Sample Articles**: `supabase/insert_15_articles.sql` ✅

### 2️⃣ **Get Your Supabase Credentials**

From your [Supabase Dashboard](https://supabase.com/dashboard):

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3️⃣ **Push Your Code to Git**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Netlify deployment"

# Create a GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/autoecole.git
git branch -M main
git push -u origin main
```

### 4️⃣ **Deploy to Netlify**

#### Option A: Git Integration (Recommended)

1. **Go to [Netlify](https://app.netlify.com/)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your `autoecole` repository
5. Configure build settings:
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: .next
   ```
6. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   NODE_OPTIONS = --max-old-space-size=8192
   ```
7. Click **"Deploy site"**

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts and set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_supabase_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_anon_key"
netlify env:set NODE_OPTIONS "--max-old-space-size=8192"

# Deploy
netlify deploy --prod
```

### 5️⃣ **Configure Supabase for Production**

After deployment, update your Supabase settings:

1. Go to **Authentication** → **URL Configuration**
2. Add your Netlify URL to **Site URL**: `https://your-site.netlify.app`
3. Add to **Redirect URLs**:
   ```
   https://your-site.netlify.app/auth/callback
   https://your-site.netlify.app/admin
   https://your-site.netlify.app/dashboard
   ```

### 6️⃣ **Test Your Deployment**

Visit your deployed site and test:
- ✅ Homepage loads correctly
- ✅ Blog page displays articles
- ✅ Individual blog posts work
- ✅ User authentication (sign up/login)
- ✅ Dashboard access
- ✅ Admin panel login (`admin@test.com` / `Test123!`)
- ✅ Quiz functionality
- ✅ Article creation in admin panel
- ✅ Image uploads work

## 🔧 Configuration Files

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=8192"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGci...` |
| `NODE_OPTIONS` | Node memory limit | `--max-old-space-size=8192` |

## 🐛 Troubleshooting

### Build Fails with Memory Error
- ✅ Already configured: `NODE_OPTIONS = --max-old-space-size=8192`

### Images Not Loading
- Check Supabase Storage bucket is public
- Verify `next.config.js` has correct remote patterns

### Authentication Not Working
- Verify environment variables are set correctly
- Check Supabase redirect URLs include your Netlify domain

### Blog Posts Not Showing
- Ensure you ran `insert_15_articles.sql` in Supabase
- Check `is_published = true` for articles

### Admin Panel Login Fails
- Verify admin user exists in Supabase
- Default: `admin@test.com` / `Test123!`
- Check browser console and Supabase Auth logs

## 🔄 Continuous Deployment

Once set up, every push to your `main` branch will automatically:
1. Trigger a new build on Netlify
2. Run tests and build process
3. Deploy to production if successful

## 📊 Performance Optimizations

Your site includes:
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting
- ✅ Server-side rendering
- ✅ Static asset caching
- ✅ Supabase CDN for images
- ✅ Gzip compression

## 🎯 Post-Deployment

### Update SEO
1. Update `public/sitemap.xml` with your domain
2. Update `public/robots.txt` with your domain
3. Submit sitemap to Google Search Console

### Analytics (Optional)
Add Netlify Analytics or Google Analytics to track visitors.

### Custom Domain (Optional)
1. Go to Netlify **Domain settings**
2. Add your custom domain
3. Configure DNS records
4. Update Supabase redirect URLs

## 🎉 You're Live!

Your AutoEcole website is now deployed with:
- 🔐 Full authentication system
- 📝 Blog with 15 articles
- 👤 User dashboard with quizzes
- 🛠️ Admin panel for content management
- 📸 Image upload functionality
- 🚀 Optimized performance

**Your site is ready to accept real users!** 🚗✨

## 📞 Need Help?

If you encounter issues:
1. Check Netlify build logs
2. Check Supabase logs (Database & Auth)
3. Verify all environment variables are set
4. Test locally first with `npm run build && npm start`

