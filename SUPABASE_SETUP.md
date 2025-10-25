# Supabase Reservation System Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Project Name**: autoecole-reservations
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 2. Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Configure Environment Variables

1. Create a file named `.env.local` in your project root
2. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Important**: Never commit `.env.local` to git!

### 4. Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content of `supabase/schema.sql`
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. Wait for "Success. No rows returned" message

This will create:
- ✅ Users profiles table
- ✅ Instructors table (with 3 sample instructors)
- ✅ Vehicles table (with 3 sample vehicles)
- ✅ Lessons table (available time slots)
- ✅ Reservations table
- ✅ Payments table (for future use)
- ✅ Row Level Security policies
- ✅ Automatic triggers

### 5. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates in **Email Templates**

### 6. Add Sample Lessons (Optional)

To add test lessons for booking:

```sql
-- Run this in SQL Editor to create sample lessons for next 7 days
INSERT INTO public.lessons (instructor_id, vehicle_id, lesson_date, start_time, end_time, duration_minutes, lesson_type, status, price)
SELECT 
  i.id,
  v.id,
  CURRENT_DATE + (d || ' days')::interval,
  t.start_time,
  t.end_time,
  60,
  'conduite',
  'available',
  45.00
FROM 
  (SELECT id FROM public.instructors LIMIT 3) i,
  (SELECT id FROM public.vehicles LIMIT 3) v,
  generate_series(1, 7) d,
  (VALUES 
    ('09:00'::time, '10:00'::time),
    ('10:00'::time, '11:00'::time),
    ('14:00'::time, '15:00'::time),
    ('15:00'::time, '16:00'::time),
    ('16:00'::time, '17:00'::time)
  ) AS t(start_time, end_time)
ORDER BY RANDOM()
LIMIT 50;
```

### 7. Test the Application

1. Start your development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. Test the flow:
   - ✅ Click "Réserver une leçon" → Auth modal opens
   - ✅ Sign up with email/password
   - ✅ Check email for confirmation (or disable email confirmation for testing)
   - ✅ Login and access dashboard
   - ✅ Browse available lessons
   - ✅ Make a reservation
   - ✅ View reservation in dashboard
   - ✅ Cancel reservation

### 8. Disable Email Confirmation (For Testing)

1. Go to **Authentication** → **Providers**
2. Scroll to **Email**
3. Turn OFF "Confirm email"
4. Click **Save**

Now users can login immediately after signup without email confirmation.

## 📊 Database Structure

### Tables Overview

- **profiles** - User profiles (extends auth.users)
- **instructors** - Driving instructors
- **vehicles** - School vehicles
- **lessons** - Available time slots
- **reservations** - User bookings
- **payments** - Payment records (future)

### User Flow

1. User signs up → Profile automatically created
2. User browses available lessons (filtered by date, instructor, type)
3. User books a lesson → Reservation created, lesson marked as "booked"
4. User views reservations in dashboard
5. User can cancel → Reservation cancelled, lesson back to "available"

## 🔐 Security Features

- **Row Level Security (RLS)** - Users only see their own data
- **Automatic profile creation** - Triggered on signup
- **Status management** - Automatic lesson status updates
- **Authentication required** - Protected routes for dashboard and booking

## 🎨 Features Implemented

### Authentication
- ✅ Login/Signup modal
- ✅ Email/password authentication
- ✅ Session management
- ✅ Protected routes

### Dashboard
- ✅ View all reservations
- ✅ Stats (total, confirmed, pending, completed)
- ✅ Cancel reservations
- ✅ Logout functionality

### Booking System
- ✅ Browse available lessons
- ✅ Filter by instructor and lesson type
- ✅ Group by date
- ✅ Instant reservation
- ✅ Real-time availability

## 🚨 Troubleshooting

### "Invalid API Key" Error
- Check your `.env.local` file has correct credentials
- Restart dev server after adding env variables

### Can't See Lessons
- Run the sample lessons SQL query above
- Check lessons table has data: `SELECT * FROM lessons;`

### Email Confirmation Required
- Disable email confirmation in Authentication settings
- Or check your email for confirmation link

### Database Connection Error
- Verify Supabase project is active
- Check Project URL is correct in `.env.local`

## 📝 Next Steps (Optional Enhancements)

1. **Admin Panel** - Manage lessons, instructors, vehicles
2. **Payment Integration** - Stripe/PayPal for lesson payments
3. **Email Notifications** - Booking confirmations, reminders
4. **Calendar View** - Visual calendar for lesson selection
5. **Instructor Availability** - Set specific availability per instructor
6. **Student Progress** - Track lessons completed, exam results
7. **Review System** - Students review instructors
8. **Multi-language** - French/English support

## 🆘 Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Support**: Check Supabase Discord or GitHub issues

---

**Your reservation system is now ready! 🎉**

