import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { CommissionSection } from "@/components/home/commission-section"
import { getSiteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Comisión Directiva",
  description:
    "Comisión directiva, vocales y tribunales del Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza.",
  alternates: { canonical: "/comision-directiva" },
  openGraph: {
    title: "Comisión Directiva | Colegio de Martilleros Mendoza",
    url: `${getSiteUrl()}/comision-directiva`,
    type: "website",
  },
}

export default function ComisionDirectivaPage() {
  return (
    <PublicLayout>
      <CommissionSection />
    </PublicLayout>
  )
}
