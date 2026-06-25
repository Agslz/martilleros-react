export const EDICTO_PREVIEW_STORAGE_KEY = "edicto-preview-draft"

export type EdictoPreviewDraft = {
  titulo: string
  descripcion: string
  precioInicial: number
  incrementos?: number
  domicilio: string
  edictoTexto: string
  numeroEdicto?: string
  fechasPublicacionBoletin: string[]
  nombreMartillero: string
  martilleroACargo: string
  cuitMartillero?: string
  telefonoMartillero?: string
  imagenUrls: string[]
}

export function guardarBorradorVistaPrevia(draft: EdictoPreviewDraft): void {
  if (typeof window === "undefined") return
  localStorage.setItem(EDICTO_PREVIEW_STORAGE_KEY, JSON.stringify(draft))
}

export function leerBorradorVistaPrevia(): EdictoPreviewDraft | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(EDICTO_PREVIEW_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as EdictoPreviewDraft
  } catch {
    return null
  }
}

export function limpiarBorradorVistaPrevia(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(EDICTO_PREVIEW_STORAGE_KEY)
}

/** Convierte archivos a data URLs para que la vista previa funcione en otra pestaña. */
export function archivosADataUrls(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
    )
  )
}
