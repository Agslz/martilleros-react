import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { HeroSection } from "@/components/home/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { AboutSection } from "@/components/home/about-section"
import { CommissionSection } from "@/components/home/commission-section"
import { CTASection } from "@/components/home/cta-section"
import { WhatsAppFab } from "@/components/home/whatsapp-fab"
import { getSiteUrl } from "@/lib/site"
import { getContenido } from "@/lib/api"
import { parseHomeContenido } from "@/lib/contenidos"

const desc =
  "Institución oficial de Mendoza. Registro de matriculados, búsqueda de martilleros habilitados, edictos, trámites e información de contacto."

export const metadata: Metadata = {
  title: {
    absolute:
      "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
  },
  description: desc,
  keywords: [
    "martilleros Mendoza",
    "corredores de comercio Mendoza",
    "edictos",
    "subastas públicas",
    "matriculados",
    "Colegio de Martilleros",
    "Argentina",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    description: desc,
    url: getSiteUrl(),
    type: "website",
  },
}

export default async function HomePage() {
  const contenidoHome = await getContenido("HOME")
  const home = parseHomeContenido(contenidoHome)

  return (
    <PublicLayout>
      <HeroSection intro={home.intro} />
      <ServicesSection />
      <AboutSection sobre={home.sobre} />
      <CommissionSection />
      <CTASection />
      <WhatsAppFab />
    </PublicLayout>
  )
}
