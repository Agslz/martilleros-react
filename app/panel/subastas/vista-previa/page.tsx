"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EdictoVistaPrevia } from "@/components/edictos/edicto-vista-previa"
import {
  leerBorradorVistaPrevia,
  type EdictoPreviewDraft,
} from "@/lib/edicto-preview"

export default function VistaPreviaEdictoPage() {
  const [draft, setDraft] = useState<EdictoPreviewDraft | null>(null)

  useEffect(() => {
    setDraft(leerBorradorVistaPrevia())
  }, [])

  if (!draft) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-muted-foreground">
          No hay borrador de vista previa. Volvé al formulario de nuevo edicto y
          usá el botón &quot;Vista previa&quot;.
        </p>
        <Link
          href="/panel/subastas/nueva"
          className="text-primary hover:underline text-sm"
        >
          Ir a nuevo edicto
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Esta es una vista previa. El edicto aún no fue publicado. Si está
        conforme, cerrá esta pestaña y presioná &quot;Publicar edicto&quot; en el
        formulario.
      </div>
      <Link
        href="/panel/subastas/nueva"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al formulario
      </Link>
      <EdictoVistaPrevia draft={draft} esPreview />
    </div>
  )
}
