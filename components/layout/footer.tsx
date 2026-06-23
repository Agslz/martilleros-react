import Link from "next/link"
import Image from "next/image"
import type { ContenidoResponse } from "@/lib/api"

const quickLinks = [
  { name: "Inicio", href: "/" },
  { name: "Padrón de asociados", href: "/buscar" },
  { name: "Edictos", href: "/edictos" },
]

const legalLinks = [
  { name: "Normativa", href: "#" },
  { name: "Aranceles", href: "#" },
  { name: "Código de Ética", href: "#" },
]

const fallbackContactHtml = `
  <p><strong>Dirección</strong><br/>Av. San Martín 1234, Ciudad<br/>Mendoza, Argentina</p>
  <p><strong>Teléfono</strong><br/>(0261) 123-4567</p>
  <p><strong>Email</strong><br/>info@martillerosmendoza.org.ar</p>
  <p><strong>Horario</strong><br/>Lunes a Viernes<br/>9:00 a 14:00 hs</p>
`

interface FooterProps {
  contenidoContacto?: ContenidoResponse | null
}

export function Footer({ contenidoContacto }: FooterProps) {
  const contactTitle = contenidoContacto?.titulo?.trim() || "Contacto"
  const contactBody = contenidoContacto?.cuerpo?.trim() || fallbackContactHtml

  return (
    <footer className="bg-institutional-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-colegio-header.png"
                alt="Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza"
                width={48}
                height={48}
                className="h-12 w-auto shrink-0 rounded-lg bg-white object-contain p-0.5"
              />
              <div>
                <p className="font-serif text-lg font-semibold leading-tight">
                  Colegio de Martilleros
                </p>
                <p className="text-sm text-white/70">Mendoza</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Institución que regula y supervisa el ejercicio profesional de
              martilleros y corredores públicos en la Provincia de Mendoza.
            </p>
          </div>

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

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {contactTitle}
            </h3>
            <div
              className="footer-contact-prose text-sm text-white/70 space-y-3 [&_a]:text-white/90 [&_a]:underline [&_a:hover]:text-white [&_p]:leading-relaxed [&_strong]:text-white/90"
              dangerouslySetInnerHTML={{ __html: contactBody }}
            />
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Colegio de Martilleros de Mendoza.
              Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/contacto"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
