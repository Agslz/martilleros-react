export const NOTICIA_PREVIEW_STORAGE_KEY = "noticia-preview-draft"

export type NoticiaPreviewDraft = {
  titulo: string
  subtitulo: string
  descripcion: string
  imagenUrls: string[]
}

export function guardarBorradorNoticiaVistaPrevia(draft: NoticiaPreviewDraft): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(NOTICIA_PREVIEW_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    const { imagenUrls: _omit, ...sinImagenes } = draft
    localStorage.setItem(
      NOTICIA_PREVIEW_STORAGE_KEY,
      JSON.stringify({ ...sinImagenes, imagenUrls: [] })
    )
  }
}

export function leerBorradorNoticiaVistaPrevia(): NoticiaPreviewDraft | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(NOTICIA_PREVIEW_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as NoticiaPreviewDraft
  } catch {
    return null
  }
}

export function limpiarBorradorNoticiaVistaPrevia(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(NOTICIA_PREVIEW_STORAGE_KEY)
}
