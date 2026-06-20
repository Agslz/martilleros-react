import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { SubastasHeader } from "@/components/subastas/subastas-header"
import { SubastasContent } from "@/components/subastas/subastas-content"
import { getSiteUrl } from "@/lib/site"

const desc =
  "Consulte los edictos y próximas subastas programadas por martilleros matriculados en el Colegio de Martilleros de Mendoza."

export const metadata: Metadata = {
  title: "Edictos",
  description: desc,
  keywords: ["edictos", "subastas Mendoza", "martilleros", "remates"],
  alternates: { canonical: "/edictos" },
  openGraph: {
    title: "Edictos y subastas | Colegio de Martilleros de Mendoza",
    description: desc,
    url: `${getSiteUrl()}/edictos`,
    type: "website",
  },
}

export default function EdictosPage() {
  return (
    <PublicLayout>
      <SubastasHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SubastasContent />
        </div>
      </section>
    </PublicLayout>
  )
}
