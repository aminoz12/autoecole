import Header from '@/components/Header'
import PromoBanner from '@/components/PromoBanner'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import MissionSection from '@/components/MissionSection'
import MediaSection from '@/components/MediaSection'
import CodeTrainingSection from '@/components/CodeTrainingSection'
import DrivingSchoolSection from '@/components/DrivingSchoolSection'
import InsuranceSection from '@/components/InsuranceSection'
import PointsRecoverySection from '@/components/PointsRecoverySection'
import PricingSection from '@/components/PricingSection'
import CPFFinancingSection from '@/components/CPFFinancingSection'
import InstructorsPreview from '@/components/InstructorsPreview'
import BlogPreview from '@/components/BlogPreview'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured blog posts
  const { data: featuredPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(5)
  return (
    <main className="min-h-screen">
      {/* Header - Sticky navigation */}
      <Header />
      
      {/* Promo Banner - Limited time offer */}
      <PromoBanner />
      
      {/* Hero Section - Main landing area */}
      <HeroSection />
      
      {/* Features Section - Why choose us */}
      <FeaturesSection />
      
      {/* Mission Section - Our mission and values */}
      <MissionSection />
      
      {/* Media Section - Media logos */}
      <MediaSection />
      
      {/* Code Training Section - Code training app */}
      <CodeTrainingSection />
      
      {/* Driving School Section - Driving school services */}
      <DrivingSchoolSection />
      
      {/* Insurance Section - Car insurance */}
      <InsuranceSection />
      
      {/* Points Recovery Section - Points recovery training */}
      <PointsRecoverySection />
      
      {/* Pricing Section - Transparent pricing */}
      <PricingSection />
      
      {/* CPF Financing Section - CPF financing promotion */}
      <CPFFinancingSection />
      
      {/* Instructors Preview - Meet our team */}
      <InstructorsPreview />
      
      {/* Blog Preview - Latest articles */}
      <BlogPreview posts={featuredPosts || []} />
      
      {/* FAQ Section - Common questions */}
      <FAQSection />
      
      {/* CTA Section - Final call to action */}
      <CTASection />
      
      {/* Footer - Links and contact info */}
      <Footer />
    </main>
  )
}

