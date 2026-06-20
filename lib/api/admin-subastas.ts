import { apiRequest, apiRequestFormData } from "./client"
import type {
  ActualizarSubastaExternaRequest,
  CrearSubastaExternaRequest,
  FileUploadResponse,
  SubastaResponse,
} from "./types"

function appendSubastaExternaFields(
  formData: FormData,
  body: CrearSubastaExternaRequest
) {
  formData.append("titulo", body.titulo)
  formData.append("descripcion", body.descripcion)
  formData.append("precioInicial", String(body.precioInicial))
  formData.append("martilleroACargo", body.martilleroACargo)
  formData.append("nombreMartillero", body.nombreMartillero)
  formData.append("cuitMartillero", body.cuitMartillero)
  formData.append("domicilio", body.domicilio)
  formData.append("fechaInicio", body.fechaInicio)
  formData.append("fechaFin", body.fechaFin)
  formData.append("edictoTexto", body.edictoTexto)
  formData.append("numeroEdicto", body.numeroEdicto)
  formData.append("fechaPublicacionBoletin", body.fechaPublicacionBoletin)
}

export type PublicacionExternaArchivos = {
  imagenes?: File[]
}

/**
 * Crea una publicación externa (admin). JSON o multipart si hay imágenes.
 * El PDF del edicto lo genera el Boletín Oficial; no se sube desde el front.
 */
export async function crearPublicacionExterna(
  body: CrearSubastaExternaRequest,
  archivos?: PublicacionExternaArchivos
): Promise<SubastaResponse | null> {
  const tieneImagenes = (archivos?.imagenes?.length ?? 0) > 0

  try {
    if (tieneImagenes) {
      const formData = new FormData()
      appendSubastaExternaFields(formData, body)
      archivos?.imagenes?.forEach((file) => formData.append("imagenes", file))

      const res = await apiRequestFormData<SubastaResponse>(
        "/admin/subastas/publicacion-externa",
        formData
      )
      if (res.success && res.data) return res.data
      return null
    }

    const res = await apiRequest<SubastaResponse>(
      "/admin/subastas/publicacion-externa",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    )
    if (res.success && res.data) return res.data
    return null
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
