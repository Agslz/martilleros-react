import Link from "next/link"
import { MapPin } from "lucide-react"
import type { ContactoContenidoData } from "@/lib/contenidos"
import {
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from "@/lib/contenidos"

interface ContactoDatosProps {
  datos: ContactoContenidoData
  /** Mostrar mapa embebido debajo de la dirección (página de contacto). */
  showMap?: boolean
  /** Variante visual para el footer oscuro. */
  variant?: "card" | "footer"
}

function ContactoLista({
  datos,
  variant,
}: {
  datos: ContactoContenidoData
  variant: "card" | "footer"
}) {
  const itemClass =
    variant === "footer"
      ? "text-sm text-white/80 leading-relaxed"
      : "text-sm text-muted-foreground leading-relaxed"

  const labelClass =
    variant === "footer"
      ? "font-semibold text-white"
      : "font-semibold text-foreground"

  const items = [
    datos.telefono.trim() && {
      label: "Teléfono",
      value: datos.telefono.trim(),
      href: `tel:${datos.telefono.replace(/\D/g, "")}`,
    },
    datos.correo.trim() && {
      label: "Correo",
      value: datos.correo.trim(),
      href: `mailto:${datos.correo.trim()}`,
    },
    datos.direccion.trim() && {
      label: "Dirección",
      value: datos.direccion.trim(),
      href: googleMapsSearchUrl(datos.direccion.trim()),
    },
  ].filter(Boolean) as { label: string; value: string; href: string }[]

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className={itemClass}>
          <span className={labelClass}>{item.label}:</span>{" "}
          <Link
            href={item.href}
            target={item.label === "Dirección" ? "_blank" : undefined}
            rel={item.label === "Dirección" ? "noopener noreferrer" : undefined}
            className={
              variant === "footer"
                ? "text-white/90 underline-offset-2 hover:underline"
                : "text-primary underline-offset-2 hover:underline"
            }
          >
            {item.value}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function ContactoDatos({
  datos,
  showMap = false,
  variant = "card",
}: ContactoDatosProps) {
  const direccion = datos.direccion.trim()

  return (
    <div>
      <ContactoLista datos={datos} variant={variant} />
      {showMap && direccion && (
        <Link
          href={googleMapsSearchUrl(direccion)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-8 block aspect-video overflow-hidden rounded-lg border border-border bg-muted"
          aria-label={`Ver ${direccion} en Google Maps`}
        >
          <iframe
            title={`Ubicación: ${direccion}`}
            src={googleMapsEmbedUrl(direccion)}
            className="pointer-events-none h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
            <span className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100">
              <MapPin className="h-4 w-4 text-primary" />
              Abrir en Google Maps
            </span>
          </div>
        </Link>
      )}
    </div>
  )
}
