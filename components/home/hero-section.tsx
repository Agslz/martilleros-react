import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Users, Gavel, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-institutional-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 mb-8">
            <span className="h-2 w-2 rounded-full bg-institutional-gold" />
            Institución Oficial de la Provincia de Mendoza
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            Regulamos y supervisamos el ejercicio profesional de martilleros y corredores públicos, 
            garantizando la transparencia y legalidad en todas las operaciones.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-institutional-navy hover:bg-white/90" asChild>
              <Link href="/buscar">
                <Search className="mr-2 h-5 w-5" />
                Buscar Martillero Habilitado
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
              <Link href="/subastas">
                Ver Subastas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/buscar"
            className="group flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Buscar Martillero</h3>
              <p className="text-sm text-white/60">Verifique habilitación</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>

          <Link 
            href="/matriculados"
            className="group flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Matriculados</h3>
              <p className="text-sm text-white/60">Listado completo</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>

          <Link 
            href="/subastas"
            className="group flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Subastas</h3>
              <p className="text-sm text-white/60">Próximas subastas</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  )
}
