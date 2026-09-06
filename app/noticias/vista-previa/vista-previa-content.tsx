"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { NoticiaArticleLayout } from "@/components/noticias/noticia-article-layout"
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
    <NoticiaArticleLayout
      titulo={draft.titulo || "Sin título"}
      subtitulo={draft.subtitulo || "Sin subtítulo"}
      descripcion={draft.descripcion || "Sin descripción"}
      imagenes={imagenes}
      topSlot={<Badge variant="secondary">Vista previa — aún no publicada</Badge>}
      bottomSlot={
        <p className="text-sm text-muted-foreground border-t border-border pt-4">
          Si te gusta cómo se ve, cerrá esta pestaña y publicá la noticia desde el
          panel admin.
        </p>
      }
    />
  )
}
