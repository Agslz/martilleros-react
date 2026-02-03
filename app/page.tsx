import { PublicLayout } from "@/components/layout/public-layout"
import { HeroSection } from "@/components/home/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { AboutSection } from "@/components/home/about-section"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <StatsSection />
      <CTASection />
    </PublicLayout>
  )
}
