import { apiRequest, apiRequestFormData } from "./client"
import type { NoticiaResponse, CrearNoticiaRequest, ActualizarNoticiaRequest } from "./types"

export async function getNoticiasPublicas(limit?: number): Promise<NoticiaResponse[]> {
  try {
    const query = limit && limit > 0 ? `?limit=${limit}` : ""
    const res = await apiRequest<NoticiaResponse[]>(`/public/noticias${query}`, {
      auth: false,
    })
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener noticias:", e)
    return []
  }
}

export async function getNoticiaPublicaById(id: number): Promise<NoticiaResponse | null> {
  try {
    const res = await apiRequest<NoticiaResponse>(`/public/noticias/${id}`, {
      auth: false,
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al obtener noticia:", e)
    return null
  }
}

export async function getNoticiasAdmin(): Promise<NoticiaResponse[]> {
  const res = await apiRequest<NoticiaResponse[]>("/admin/noticias")
  if (res.success && Array.isArray(res.data)) return res.data
  return []
}

export async function getNoticiaAdminById(id: number): Promise<NoticiaResponse | null> {
  const res = await apiRequest<NoticiaResponse>(`/admin/noticias/${id}`)
  if (res.success && res.data) return res.data
  return null
}

export async function crearNoticia(
  body: CrearNoticiaRequest
): Promise<NoticiaResponse | null> {
  const res = await apiRequest<NoticiaResponse>("/admin/noticias", {
    method: "POST",
    body: JSON.stringify(body),
  })
  if (res.success && res.data) return res.data
  return null
}

export async function actualizarNoticia(
  id: number,
  body: ActualizarNoticiaRequest
): Promise<NoticiaResponse | null> {
  const res = await apiRequest<NoticiaResponse>(`/admin/noticias/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
  if (res.success && res.data) return res.data
  return null
}

export async function publicarNoticia(id: number): Promise<NoticiaResponse | null> {
  const res = await apiRequest<NoticiaResponse>(`/admin/noticias/${id}/publicar`, {
    method: "POST",
  })
  if (res.success && res.data) return res.data
  return null
}

export async function despublicarNoticia(id: number): Promise<NoticiaResponse | null> {
  const res = await apiRequest<NoticiaResponse>(`/admin/noticias/${id}/despublicar`, {
    method: "POST",
  })
  if (res.success && res.data) return res.data
  return null
}

export async function eliminarNoticia(id: number): Promise<boolean> {
  const res = await apiRequest<void>(`/admin/noticias/${id}`, { method: "DELETE" })
  return res.success
}

export async function subirImagenNoticia(
  noticiaId: number,
  file: File,
  orden?: number
): Promise<{ id: number; fileUrl: string } | null> {
  const formData = new FormData()
  formData.append("file", file)
  if (orden !== undefined) formData.append("orden", String(orden))
  const res = await apiRequestFormData<{ id: number; fileUrl: string }>(
    `/admin/noticias/${noticiaId}/imagenes`,
    formData
  )
  if (res.success && res.data) return res.data
  return null
}

export async function eliminarImagenNoticia(
  noticiaId: number,
  imagenId: number
): Promise<boolean> {
  const res = await apiRequest<void>(
    `/admin/noticias/${noticiaId}/imagenes/${imagenId}`,
    { method: "DELETE" }
  )
  return res.success
}
