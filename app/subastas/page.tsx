import { PublicLayout } from "@/components/layout/public-layout"
import { SubastasHeader } from "@/components/subastas/subastas-header"
import { SubastasContent } from "@/components/subastas/subastas-content"

export const metadata = {
  title: "Subastas | Colegio de Martilleros de Mendoza",
  description: "Consulte las próximas subastas programadas por martilleros matriculados en el Colegio de Martilleros de Mendoza.",
}

export default function SubastasPage() {
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
