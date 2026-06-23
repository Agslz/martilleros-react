import { ContactoDatos } from "@/components/contacto/contacto-datos"
import type { ContenidoResponse } from "@/lib/api"
import { parseContactoContenido } from "@/lib/contenidos"

interface ContactoInfoProps {
  contenido?: ContenidoResponse | null
}

export function ContactoInfo({ contenido }: ContactoInfoProps) {
  const datos = parseContactoContenido(contenido)

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Contacto</h2>
      <ContactoDatos datos={datos} showMap />
    </div>
  )
}
