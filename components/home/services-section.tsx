import { Shield, FileCheck, Scale, BookOpen } from "lucide-react"

const services = [
  {
    icon: Shield,
    title: "Verificación de Habilitación",
    description: "Consulte si un martillero está habilitado para ejercer la profesión en la provincia de Mendoza.",
  },
  {
    icon: FileCheck,
    title: "Registro de Subastas",
    description: "Acceda al listado de subastas programadas por martilleros matriculados en nuestra institución.",
  },
  {
    icon: Scale,
    title: "Regulación Profesional",
    description: "Garantizamos el cumplimiento de las normativas vigentes para el ejercicio de la profesión.",
  },
  {
    icon: BookOpen,
    title: "Capacitación Continua",
    description: "Brindamos formación y actualización profesional para nuestros matriculados.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Nuestros Servicios
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Funciones Institucionales
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            El Colegio de Martilleros de Mendoza cumple funciones esenciales para garantizar 
            la transparencia y profesionalismo en el sector.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
