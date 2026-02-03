import { PublicLayout } from "@/components/layout/public-layout"
import { DireccionesHeader } from "@/components/direcciones/direcciones-header"
import { DireccionesList } from "@/components/direcciones/direcciones-list"

export const metadata = {
  title: "Direcciones y Sedes | Colegio de Martilleros de Mendoza",
  description: "Encuentre la sede principal y las delegaciones del Colegio de Martilleros de Mendoza.",
}

export default function DireccionesPage() {
  return (
    <PublicLayout>
      <DireccionesHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DireccionesList />
        </div>
      </section>
    </PublicLayout>
  )
}
