import { Mail } from "lucide-react"

export function ContactoHeader() {
  return (
    <section className="bg-institutional-navy py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-white/10 mb-6">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Contacto
          </h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Estamos aquí para ayudarte. Completá el formulario o contactanos 
            directamente a través de nuestros canales de comunicación.
          </p>
        </div>
      </div>
    </section>
  )
}
