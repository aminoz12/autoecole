-- Auto-École Reservation System Database Schema
-- Execute these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructors table
CREATE TABLE public.instructors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialties TEXT[], -- e.g., ['manuel', 'automatique', 'moto']
  photo_url TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  model TEXT NOT NULL,
  plate_number TEXT UNIQUE NOT NULL,
  transmission_type TEXT NOT NULL CHECK (transmission_type IN ('manuel', 'automatique')),
  year INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table (available time slots)
CREATE TABLE public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  lesson_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('conduite', 'code', 'examen_blanc')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'completed', 'cancelled')),
  price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(instructor_id, lesson_date, start_time)
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lesson_id) -- One reservation per lesson
);

-- Create payments table (optional for future)
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table to track user quiz progress
CREATE TABLE public.quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL, -- e.g., 'priority-rules', 'road-signs', 'general-code', 'emergency'
  quiz_title TEXT NOT NULL,
  score INTEGER NOT NULL, -- Number of correct answers
  total_questions INTEGER NOT NULL, -- Total questions in the quiz
  percentage INTEGER NOT NULL, -- Score percentage
  time_taken_seconds INTEGER, -- Optional: time taken to complete
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create online_courses_progress table to track video courses
CREATE TABLE public.online_courses_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, -- e.g., 'priority-rules', 'road-signs', etc.
  course_title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  last_watched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX idx_lessons_date ON public.lessons(lesson_date);
CREATE INDEX idx_lessons_instructor ON public.lessons(instructor_id);
CREATE INDEX idx_lessons_status ON public.lessons(status);
CREATE INDEX idx_reservations_user ON public.reservations(user_id);
CREATE INDEX idx_reservations_lesson ON public.reservations(lesson_id);
CREATE INDEX idx_quiz_results_user ON public.quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON public.quiz_results(quiz_id);
CREATE INDEX idx_online_courses_progress_user ON public.online_courses_progress(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_courses_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for instructors (public read)
CREATE POLICY "Anyone can view active instructors" ON public.instructors
  FOR SELECT USING (active = true);

-- RLS Policies for vehicles (public read)
CREATE POLICY "Anyone can view active vehicles" ON public.vehicles
  FOR SELECT USING (active = true);

-- RLS Policies for lessons (public read for available lessons)
CREATE POLICY "Anyone can view available lessons" ON public.lessons
  FOR SELECT USING (status = 'available' OR status = 'booked');

-- RLS Policies for reservations
CREATE POLICY "Users can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    reservation_id IN (
      SELECT id FROM public.reservations WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for quiz_results
CREATE POLICY "Users can view their own quiz results" ON public.quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz results" ON public.quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for online_courses_progress
CREATE POLICY "Users can view their own course progress" ON public.online_courses_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress" ON public.online_courses_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON public.online_courses_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update lesson status when reserved
CREATE OR REPLACE FUNCTION public.update_lesson_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'pending') THEN
    UPDATE public.lessons
    SET status = 'booked'
    WHERE id = NEW.lesson_id;
  ELSIF NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'pending') THEN
    UPDATE public.lessons
    SET status = 'available'
    WHERE id = NEW.lesson_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update lesson status
CREATE TRIGGER on_reservation_status_change
  AFTER INSERT OR UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_lesson_status();

-- Insert sample instructors (optional)
INSERT INTO public.instructors (name, email, phone, specialties, active) VALUES
  ('Jean Dupont', 'jean@autoecole.fr', '0601020304', ARRAY['manuel', 'automatique'], true),
  ('Marie Martin', 'marie@autoecole.fr', '0602030405', ARRAY['manuel', 'moto'], true),
  ('Pierre Lefebvre', 'pierre@autoecole.fr', '0603040506', ARRAY['automatique'], true);

-- Insert sample vehicles (optional)
INSERT INTO public.vehicles (model, plate_number, transmission_type, year, active) VALUES
  ('Renault Clio', 'AB-123-CD', 'manuel', 2022, true),
  ('Peugeot 208', 'EF-456-GH', 'automatique', 2023, true),
  ('Citroën C3', 'IJ-789-KL', 'manuel', 2021, true);

