import { CheckCircle2 } from "lucide-react"

const features = [
  "Control y supervisión del ejercicio profesional",
  "Registro y habilitación de matriculados",
  "Defensa de los intereses de la profesión",
  "Actualización y capacitación continua",
  "Asesoramiento legal y técnico",
  "Mediación en conflictos profesionales",
]

export function AboutSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sobre Nosotros
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Más de 50 años regulando la profesión en Mendoza
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              El Colegio de Martilleros y Corredores Públicos de Mendoza es la institución 
              encargada de regular, supervisar y promover el ejercicio ético y profesional 
              de martilleros y corredores en toda la provincia.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Nuestra misión es garantizar que todos los profesionales matriculados cumplan 
              con los más altos estándares de calidad, transparencia y legalidad en cada 
              operación que realizan.
            </p>

            {/* Features List */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-institutional-navy to-institutional-blue overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-6">
                    <span className="font-serif text-4xl font-bold">CM</span>
                  </div>
                  <p className="font-serif text-2xl font-semibold">
                    Colegio de Martilleros
                  </p>
                  <p className="text-white/70 mt-2">Mendoza, Argentina</p>
                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
                    <span>Est. 1970</span>
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    <span>Ley Provincial N° 2.957</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl bg-institutional-gold/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
