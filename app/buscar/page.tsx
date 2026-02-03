import { PublicLayout } from "@/components/layout/public-layout"
import { BuscarHeader } from "@/components/buscar/buscar-header"
import { BuscarForm } from "@/components/buscar/buscar-form"
import { BuscarResults } from "@/components/buscar/buscar-results"

export const metadata = {
  title: "Buscar Martillero Habilitado | Colegio de Martilleros de Mendoza",
  description: "Verifique si un martillero está habilitado para ejercer la profesión en la Provincia de Mendoza.",
}

export default function BuscarPage() {
  return (
    <PublicLayout>
      <BuscarHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <BuscarForm />
          <BuscarResults />
        </div>
      </section>
    </PublicLayout>
  )
}
