"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PublicLayout } from "@/components/layout/public-layout"
import { EdictoVistaPrevia } from "@/components/edictos/edicto-vista-previa"
import {
  leerBorradorVistaPrevia,
  type EdictoPreviewDraft,
} from "@/lib/edicto-preview"

export default function VistaPreviaEdictoPublicPage() {
  const [draft, setDraft] = useState<EdictoPreviewDraft | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setDraft(leerBorradorVistaPrevia())
    setLoaded(true)
  }, [])

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {!loaded ? (
          <p className="text-muted-foreground text-center py-12">
            Cargando vista previa…
          </p>
        ) : !draft ? (
          <div className="max-w-lg mx-auto text-center space-y-4 py-12">
            <p className="text-muted-foreground">
              No hay borrador de vista previa. Volvé al formulario de edicto y
              usá el botón &quot;Vista previa&quot;.
            </p>
            <Link
              href="/panel/subastas/nueva"
              className="text-primary hover:underline text-sm"
            >
              Ir a nuevo edicto
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Esta es una vista previa. El edicto aún no fue publicado. Si está
              conforme, cerrá esta pestaña y presioná &quot;Publicar edicto&quot; en
              el formulario.
            </div>
            <EdictoVistaPrevia draft={draft} esPreview />
          </>
        )}
      </div>
    </PublicLayout>
  )
}
