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
  sessionStorage.setItem(EDICTO_PREVIEW_STORAGE_KEY, JSON.stringify(draft))
}

export function leerBorradorVistaPrevia(): EdictoPreviewDraft | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(EDICTO_PREVIEW_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as EdictoPreviewDraft
  } catch {
    return null
  }
}

export function limpiarBorradorVistaPrevia(): void {
  sessionStorage.removeItem(EDICTO_PREVIEW_STORAGE_KEY)
}
