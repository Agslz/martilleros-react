import Link from "next/link"
import { Gavel, MapPin, Phone, Mail, Clock } from "lucide-react"

const quickLinks = [
  { name: "Inicio", href: "/" },
  { name: "Asociados", href: "/matriculados" },
  { name: "Padrón de asociados", href: "/buscar" },
  { name: "Subastas", href: "/subastas" },
]

const legalLinks = [
  { name: "Normativa", href: "#" },
  { name: "Aranceles", href: "#" },
  { name: "Código de Ética", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-institutional-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold leading-tight">
                  Colegio de Martilleros
                </p>
                <p className="text-sm text-white/70">Mendoza</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Institución que regula y supervisa el ejercicio profesional de martilleros y corredores públicos en la Provincia de Mendoza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Información Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">
                  Av. San Martín 1234, Ciudad<br />
                  Mendoza, Argentina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/50 shrink-0" />
                <span className="text-sm text-white/70">(0261) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/50 shrink-0" />
                <span className="text-sm text-white/70">info@martillerosmendoza.org.ar</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">
                  Lunes a Viernes<br />
                  9:00 a 14:00 hs
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Colegio de Martilleros de Mendoza. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/contacto" className="text-sm text-white/50 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link href="/direcciones" className="text-sm text-white/50 hover:text-white transition-colors">
                Direcciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
