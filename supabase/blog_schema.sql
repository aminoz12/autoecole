-- Blog System Schema
-- Run this in your Supabase SQL Editor

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  category TEXT,
  tags TEXT[], -- Array of tags
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
-- Public can read published posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

-- Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can create posts
CREATE POLICY "Authenticated users can create blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only author or admin can update posts
CREATE POLICY "Authors can update their own blog posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id OR auth.role() = 'authenticated');

-- Only author or admin can delete posts
CREATE POLICY "Authors can delete their own blog posts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = author_id OR auth.role() = 'authenticated');

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON public.blog_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on blog_posts
CREATE TRIGGER blog_post_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_blog_post_updated_at();

-- Insert sample categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Code de la route', 'code-route', 'Tout sur le code de la route'),
  ('Permis de conduire', 'permis-conduire', 'Conseils pour réussir votre permis'),
  ('Sécurité routière', 'securite-routiere', 'Conseils de sécurité sur la route'),
  ('Assurance auto', 'assurance-auto', 'Informations sur l''assurance automobile'),
  ('Actualités', 'actualites', 'Dernières actualités du monde automobile')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
INSERT INTO public.blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  author_name, 
  category, 
  tags, 
  is_featured, 
  is_published,
  seo_title,
  seo_description,
  seo_keywords,
  published_at
) VALUES
(
  'Les 10 erreurs à éviter lors de l''examen du code',
  '10-erreurs-examen-code',
  'Découvrez les erreurs les plus courantes que font les candidats à l''examen du code de la route et comment les éviter.',
  '<h2>Introduction</h2><p>Passer l''examen du code de la route peut être stressant. Voici les 10 erreurs les plus fréquentes à éviter pour maximiser vos chances de réussite.</p><h2>1. Ne pas assez réviser</h2><p>La préparation est la clé du succès. Assurez-vous de réviser régulièrement et de faire des tests pratiques.</p><h2>2. Ignorer les panneaux de signalisation</h2><p>Les panneaux sont essentiels. Apprenez-les par cœur et comprenez leur signification.</p>',
  'AutoEcole Pro',
  'Code de la route',
  ARRAY['code de la route', 'examen', 'conseils', 'erreurs'],
  true,
  true,
  'Les 10 erreurs à éviter lors de l''examen du code | AutoEcole Pro',
  'Découvrez les erreurs les plus courantes à l''examen du code de la route et comment les éviter pour réussir du premier coup.',
  ARRAY['examen code', 'erreurs code route', 'réussir code', 'conseils code'],
  NOW() - INTERVAL '5 days'
),
(
  'Comment gérer son stress le jour de l''examen de conduite',
  'gerer-stress-examen-conduite',
  'Le stress peut affecter vos performances. Découvrez nos techniques pour rester calme et concentré le jour J.',
  '<h2>Pourquoi le stress affecte vos performances</h2><p>Le stress peut vous faire commettre des erreurs que vous ne feriez pas normalement. Voici comment le gérer.</p><h2>Techniques de respiration</h2><p>La respiration profonde aide à calmer le système nerveux.</p>',
  'AutoEcole Pro',
  'Permis de conduire',
  ARRAY['permis', 'stress', 'examen', 'conduite'],
  true,
  true,
  'Comment gérer son stress le jour de l''examen de conduite',
  'Techniques éprouvées pour rester calme et concentré lors de votre examen de conduite.',
  ARRAY['stress examen conduite', 'gérer stress permis', 'relaxation conduite'],
  NOW() - INTERVAL '3 days'
),
(
  'Les nouvelles règles de circulation 2024',
  'nouvelles-regles-circulation-2024',
  'Restez à jour avec les dernières modifications du code de la route entrées en vigueur en 2024.',
  '<h2>Changements majeurs en 2024</h2><p>Plusieurs nouvelles règles sont entrées en vigueur cette année.</p><h2>Zones à faibles émissions</h2><p>De nouvelles restrictions s''appliquent dans les grandes villes.</p>',
  'AutoEcole Pro',
  'Actualités',
  ARRAY['actualités', 'code de la route', '2024', 'nouvelles règles'],
  true,
  true,
  'Les nouvelles règles de circulation 2024 | AutoEcole Pro',
  'Découvrez toutes les nouvelles règles de circulation entrées en vigueur en 2024.',
  ARRAY['règles 2024', 'code route 2024', 'nouvelles règles circulation'],
  NOW() - INTERVAL '1 day'
),
(
  'Conduite en hiver : nos conseils essentiels',
  'conduite-hiver-conseils',
  'L''hiver apporte son lot de défis pour les conducteurs. Voici comment conduire en toute sécurité.',
  '<h2>Préparation du véhicule</h2><p>Avant l''hiver, vérifiez vos pneus, votre batterie et votre antigel.</p><h2>Techniques de conduite sur neige</h2><p>Réduisez votre vitesse et augmentez les distances de sécurité.</p>',
  'AutoEcole Pro',
  'Sécurité routière',
  ARRAY['sécurité', 'hiver', 'conduite', 'neige'],
  true,
  true,
  'Conduite en hiver : nos conseils essentiels | AutoEcole Pro',
  'Tous nos conseils pour conduire en toute sécurité pendant l''hiver.',
  ARRAY['conduite hiver', 'conduire neige', 'sécurité hiver'],
  NOW() - INTERVAL '7 days'
),
(
  'Assurance jeune conducteur : comment économiser',
  'assurance-jeune-conducteur-economiser',
  'L''assurance pour jeunes conducteurs peut être coûteuse. Découvrez nos astuces pour réduire vos primes.',
  '<h2>Pourquoi l''assurance est-elle plus chère pour les jeunes ?</h2><p>Les statistiques montrent un risque plus élevé d''accidents.</p><h2>Astuces pour réduire le coût</h2><p>La conduite accompagnée peut réduire considérablement vos primes.</p>',
  'AutoEcole Pro',
  'Assurance auto',
  ARRAY['assurance', 'jeune conducteur', 'économies', 'conseils'],
  true,
  true,
  'Assurance jeune conducteur : comment économiser | AutoEcole Pro',
  'Découvrez comment réduire le coût de votre assurance auto en tant que jeune conducteur.',
  ARRAY['assurance jeune conducteur', 'réduire assurance auto', 'économiser assurance'],
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (slug) DO NOTHING;

