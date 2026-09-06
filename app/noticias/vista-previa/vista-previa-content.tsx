"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { NoticiaCarousel } from "@/components/noticias/noticia-carousel"
import {
  leerBorradorNoticiaVistaPrevia,
  type NoticiaPreviewDraft,
} from "@/lib/noticia-preview"

export default function NoticiaVistaPreviaContent() {
  const [draft, setDraft] = useState<NoticiaPreviewDraft | null>(null)

  useEffect(() => {
    setDraft(leerBorradorNoticiaVistaPrevia())
  }, [])

  if (!draft) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        No hay borrador de vista previa. Volvé al panel admin, cargá la noticia y
        abrí nuevamente la vista previa.
      </div>
    )
  }

  const imagenes = (draft.imagenUrls ?? []).map((url, i) => ({
    url,
    alt: `Vista previa ${i + 1}`,
  }))

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <Badge variant="secondary">Vista previa — aún no publicada</Badge>
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
          {draft.titulo || "Sin título"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {draft.subtitulo || "Sin subtítulo"}
        </p>
      </header>
      {imagenes.length > 0 && <NoticiaCarousel images={imagenes} />}
      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
        {draft.descripcion || "Sin descripción"}
      </p>
      <p className="text-sm text-muted-foreground border-t border-border pt-4">
        Si te gusta cómo se ve, cerrá esta pestaña y publicá la noticia desde el
        panel admin.
      </p>
    </article>
  )
}
