import Link from "next/link"
import Image from "next/image"
import { ContactoDatos } from "@/components/contacto/contacto-datos"
import type { ContenidoResponse } from "@/lib/api"
import { parseContactoContenido } from "@/lib/contenidos"

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

interface FooterProps {
  contenidoContacto?: ContenidoResponse | null
}

export function Footer({ contenidoContacto }: FooterProps) {
  const contactoDatos = parseContactoContenido(contenidoContacto)

  return (
    <footer className="bg-institutional-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-colegio-header.png"
                alt="Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza"
                width={44}
                height={54}
                className="h-14 w-[44px] shrink-0 object-contain object-center"
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
              Contacto
            </h3>
            <ContactoDatos datos={contactoDatos} variant="footer" />
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
