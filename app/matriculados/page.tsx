import { PublicLayout } from "@/components/layout/public-layout"
import { MatriculadosHeader } from "@/components/matriculados/matriculados-header"
import { MatriculadosSearch } from "@/components/matriculados/matriculados-search"
import { MatriculadosList } from "@/components/matriculados/matriculados-list"
import { Suspense } from "react"
import Loading from "./loading"

export const metadata = {
  title: "Listado de Matriculados | Colegio de Martilleros de Mendoza",
  description: "Consulte el listado completo de martilleros y corredores públicos matriculados en el Colegio de Martilleros de Mendoza.",
}

export default function MatriculadosPage() {
  return (
    <PublicLayout>
      <MatriculadosHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<Loading />}>
            <MatriculadosSearch />
            <MatriculadosList />
          </Suspense>
        </div>
      </section>
    </PublicLayout>
  )
}
