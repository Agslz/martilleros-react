import { Building2 } from "lucide-react"

export function DireccionesHeader() {
  return (
    <section className="bg-institutional-navy py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-white/10 mb-6">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Direcciones y Sedes
          </h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Encuentre la sede principal y las delegaciones del Colegio de 
            Martilleros de Mendoza en toda la provincia.
          </p>
        </div>
      </div>
    </section>
  )
}
