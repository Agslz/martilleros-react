import { apiRequest, apiRequestFormData } from "./client"
import type {
  SubastaRequest,
  SubastaResponse,
  FileUploadResponse,
} from "./types"

export async function crearSubasta(
  body: SubastaRequest
): Promise<SubastaResponse | null> {
  try {
    const res = await apiRequest<SubastaResponse>("/admin/subastas", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear subasta:", e)
    throw e
  }
}

export async function actualizarSubasta(
  id: number,
  body: SubastaRequest
): Promise<SubastaResponse | null> {
  try {
    const res = await apiRequest<SubastaResponse>(`/admin/subastas/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al actualizar subasta:", e)
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

export async function subirEdictoSubasta(
  subastaId: number,
  file: File
): Promise<FileUploadResponse | null> {
  if (file.type !== "application/pdf") {
    throw new Error("Solo se permiten archivos PDF")
  }
  const formData = new FormData()
  formData.append("file", file)
  try {
    const res = await apiRequestFormData<FileUploadResponse>(
      `/admin/subastas/${subastaId}/edicto`,
      formData
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al subir edicto:", e)
    throw e
  }
}
