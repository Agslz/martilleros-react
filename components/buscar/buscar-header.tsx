import { Shield } from "lucide-react"

export function BuscarHeader() {
  return (
    <section className="bg-institutional-navy py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Buscar Martillero Habilitado
          </h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Verifique si un martillero está habilitado para ejercer la profesión 
            en la Provincia de Mendoza.
          </p>
        </div>
      </div>
    </section>
  )
}
