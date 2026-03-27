import { apiRequest, apiRequestFormData } from "./client"
import type {
  SubastaRequest,
  SubastaResponse,
  FileUploadResponse,
} from "./types"

/**
 * Subastas públicas (sin auth).
 *
 * Regla de visibilidad (backend):
 * - Una subasta aparece aquí desde que se crea hasta el día de fechaFin inclusive.
 * - A partir del día siguiente a fechaFin, el backend pone visiblePublico = false
 *   y ya no la devuelve en este endpoint.
 * - Sigue existiendo en el sistema y el matriculado la ve en /api/private/subastas (su historial).
 */
export async function getSubastasPublicas(): Promise<SubastaResponse[]> {
  try {
    const res = await apiRequest<SubastaResponse[]>("/public/subastas", {
      auth: false,
    })
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener subastas públicas:", e)
    return []
  }
}

/**
 * Subastas del panel privado (requiere token).
 * Devuelve todas las subastas del matriculado (vigentes e históricas), sin filtrar por visiblePublico.
 */
export async function getSubastasPrivadas(): Promise<SubastaResponse[]> {
  try {
    const res = await apiRequest<SubastaResponse[]>("/private/subastas")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener subastas:", e)
    return []
  }
}

/**
 * Crear subasta como matriculado (Bearer). El backend debe exponer POST /api/private/subastas
 * y tomar datos del martillero del JWT o del body.
 */
export async function crearSubastaMatriculado(
  body: SubastaRequest
): Promise<SubastaResponse | null> {
  try {
    const res = await apiRequest<SubastaResponse>("/private/subastas", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear subasta (matriculado):", e)
    throw e
  }
}

/**
 * Subir imagen a una subasta creada por el matriculado (Bearer).
 * Backend debe exponer POST /api/private/subastas/{id}/imagenes (multipart: file, orden opcional).
 */
export async function subirImagenSubastaMatriculado(
  subastaId: number,
  file: File,
  orden?: number
): Promise<FileUploadResponse | null> {
  const formData = new FormData()
  formData.append("file", file)
  if (orden !== undefined) formData.append("orden", String(orden))
  try {
    const res = await apiRequestFormData<FileUploadResponse>(
      `/private/subastas/${subastaId}/imagenes`,
      formData
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al subir imagen subasta (matriculado):", e)
    throw e
  }
}

/**
 * Obtiene una subasta por id desde la lista pública.
 * Si la subasta ya venció (fechaFin pasada), no está en /api/public/subastas y devuelve null → 404 en /subastas/[id].
 */
export async function getSubastaById(
  id: number
): Promise<SubastaResponse | null> {
  const list = await getSubastasPublicas()
  return list.find((s) => s.id === id) ?? null
}
