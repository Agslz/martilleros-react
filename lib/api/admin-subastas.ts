import { apiRequest, apiRequestFormData } from "./client"
import type {
  ActualizarSubastaExternaRequest,
  CrearSubastaExternaRequest,
  FileUploadResponse,
  SubastaResponse,
} from "./types"

export type PublicacionExternaArchivos = {
  imagenes?: File[]
}

/**
 * Crea una publicación externa (admin).
 * Siempre JSON (soporta bienes[]) y luego sube imágenes si hay.
 */
export async function crearPublicacionExterna(
  body: CrearSubastaExternaRequest,
  archivos?: PublicacionExternaArchivos
): Promise<SubastaResponse | null> {
  try {
    const res = await apiRequest<SubastaResponse>(
      "/admin/subastas/publicacion-externa",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    )
    if (!res.success || !res.data) return null

    const created = res.data
    const imagenes = archivos?.imagenes ?? []
    for (let i = 0; i < imagenes.length; i++) {
      await subirImagenSubasta(created.id, imagenes[i], i + 1)
    }
    return created
  } catch (e) {
    console.error("Error al crear publicación externa:", e)
    throw e
  }
}

export async function actualizarPublicacionExterna(
  id: number,
  body: ActualizarSubastaExternaRequest
): Promise<SubastaResponse | null> {
  try {
    const res = await apiRequest<SubastaResponse>(`/admin/subastas/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al actualizar publicación externa:", e)
    throw e
  }
}

export async function eliminarSubasta(id: number): Promise<boolean> {
  try {
    const res = await apiRequest<void>(`/admin/subastas/${id}`, {
      method: "DELETE",
    })
    return res.success
  } catch (e) {
    console.error("Error al eliminar subasta:", e)
    throw e
  }
}

export async function subirImagenSubasta(
  subastaId: number,
  file: File,
  orden?: number
): Promise<FileUploadResponse | null> {
  const formData = new FormData()
  formData.append("file", file)
  if (orden !== undefined) formData.append("orden", String(orden))
  try {
    const res = await apiRequestFormData<FileUploadResponse>(
      `/admin/subastas/${subastaId}/imagenes`,
      formData
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al subir imagen subasta:", e)
    throw e
  }
}

export async function eliminarImagenSubasta(
  subastaId: number,
  imagenId: number
): Promise<boolean> {
  try {
    const res = await apiRequest<void>(
      `/admin/subastas/${subastaId}/imagenes/${imagenId}`,
      { method: "DELETE" }
    )
    return res.success
  } catch (e) {
    console.error("Error al eliminar imagen:", e)
    throw e
  }
}
