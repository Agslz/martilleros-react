export const NOTICIA_PREVIEW_STORAGE_KEY = "noticia-preview-draft"

export type NoticiaPreviewMedia = {
  url: string
  contentType: string
  fileName?: string
}

export type NoticiaPreviewDraft = {
  titulo: string
  subtitulo: string
  descripcion: string
  /** @deprecated usar media */
  imagenUrls?: string[]
  media?: NoticiaPreviewMedia[]
}

export function guardarBorradorNoticiaVistaPrevia(draft: NoticiaPreviewDraft): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(NOTICIA_PREVIEW_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    const { media: _m, imagenUrls: _i, ...sinArchivos } = draft
    localStorage.setItem(
      NOTICIA_PREVIEW_STORAGE_KEY,
      JSON.stringify({ ...sinArchivos, media: [], imagenUrls: [] })
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

export async function archivosAMediaPreview(
  files: File[]
): Promise<NoticiaPreviewMedia[]> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<NoticiaPreviewMedia>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () =>
            resolve({
              url: reader.result as string,
              contentType: file.type || inferType(file.name),
              fileName: file.name,
            })
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
    )
  )
}

function inferType(name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith(".pdf")) return "application/pdf"
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".webp")) return "image/webp"
  if (lower.endsWith(".gif")) return "image/gif"
  return "image/jpeg"
}
