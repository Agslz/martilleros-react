import { apiRequest, apiRequestFormData } from "./client"
import type { CrearMatriculadoRequest, EstadoFianza } from "./types"
import type { MatriculadoPublicResponse } from "./types"

/** Respuesta exclusiva del POST de alta; incluye contrasenaTemporal en texto plano. */
export interface CrearMatriculadoResponse {
  id: number
  nombre: string
  apellido: string
  dni: string
  matricula: string
  email: string | null
  cuit: string | null
  fotoCarnetUrl: string | null
  habilitado: boolean
  primeraVezLogin: boolean
  estadoFianza: EstadoFianza
  contrasenaTemporal: string
}

export async function crearMatriculado(
  body: CrearMatriculadoRequest,
  foto?: File | null
): Promise<CrearMatriculadoResponse | null> {
  try {
    const res = foto
      ? await (() => {
          const formData = new FormData()
          formData.append("nombre", body.nombre)
          formData.append("apellido", body.apellido)
          formData.append("dni", body.dni)
          formData.append("matricula", body.matricula)
          formData.append("email", body.email)
          formData.append("cuit", body.cuit)
          if (body.telefono?.trim()) {
            formData.append("telefono", body.telefono.trim())
          }
          formData.append("foto", foto)
          return apiRequestFormData<CrearMatriculadoResponse>(
            "/admin/matriculados",
            formData,
            { method: "POST" }
          )
        })()
      : await apiRequest<CrearMatriculadoResponse>("/admin/matriculados", {
          method: "POST",
          body: JSON.stringify(body),
        })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear matriculado:", e)
    throw e
  }
}

export interface AdminMatriculadosFiltros {
  apellido?: string
  habilitado?: boolean
}

/**
 * Lista matriculados para el panel admin (GET /api/admin/matriculados).
 * Query opcionales: ?apellido=&habilitado=
 */
export async function getMatriculadosAdmin(
  filtros: AdminMatriculadosFiltros = {}
): Promise<MatriculadoPublicResponse[]> {
  const params = new URLSearchParams()
  const apellido = filtros.apellido?.trim()
  if (apellido) params.set("apellido", apellido)
  if (filtros.habilitado !== undefined) {
    params.set("habilitado", String(filtros.habilitado))
  }
  const query = params.toString()
  const path = query ? `/admin/matriculados?${query}` : "/admin/matriculados"

  const res = await apiRequest<MatriculadoPublicResponse[]>(path, { method: "GET" })
  if (res.success && Array.isArray(res.data)) return res.data
  return []
}

/**
 * Actualiza el estado habilitado de un matriculado.
 * PUT /api/admin/matriculados/{id}/habilitado
 */
export async function updateMatriculadoHabilitado(
  id: number,
  habilitado: boolean
): Promise<void> {
  await apiRequest(`/admin/matriculados/${id}/habilitado`, {
    method: "PUT",
    body: JSON.stringify({ habilitado }),
  })
}

/** Detalle admin (incluye DNI/CUIT) para edición. */
export interface MatriculadoAdminResponse {
  id: number
  nombre: string
  apellido: string
  dni: string
  matricula: string
  email: string | null
  cuit: string | null
  telefono?: string | null
  fotoCarnetUrl: string | null
  habilitado: boolean
  primeraVezLogin: boolean
  estadoFianza: EstadoFianza
}

export type ActualizarMatriculadoRequest = CrearMatriculadoRequest

export async function getMatriculadoAdmin(
  id: number
): Promise<MatriculadoAdminResponse | null> {
  const res = await apiRequest<MatriculadoAdminResponse>(
    `/admin/matriculados/${id}`,
    { method: "GET" }
  )
  if (res.success && res.data) return res.data
  return null
}

/**
 * Actualiza datos del matriculado (y foto opcional).
 * PUT /api/admin/matriculados/{id} (JSON o multipart)
 */
export async function actualizarMatriculado(
  id: number,
  body: ActualizarMatriculadoRequest,
  foto?: File | null
): Promise<MatriculadoAdminResponse | null> {
  try {
    const res = foto
      ? await (() => {
          const formData = new FormData()
          formData.append("nombre", body.nombre)
          formData.append("apellido", body.apellido)
          formData.append("dni", body.dni)
          formData.append("matricula", body.matricula)
          formData.append("email", body.email ?? "")
          formData.append("cuit", body.cuit ?? "")
          if (body.telefono?.trim()) {
            formData.append("telefono", body.telefono.trim())
          }
          formData.append("foto", foto)
          return apiRequestFormData<MatriculadoAdminResponse>(
            `/admin/matriculados/${id}`,
            formData,
            { method: "PUT" }
          )
        })()
      : await apiRequest<MatriculadoAdminResponse>(`/admin/matriculados/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al actualizar matriculado:", e)
    throw e
  }
}

/**
 * Elimina un matriculado (borrado físico con cascada en BD).
 * DELETE /api/admin/matriculados/{id}
 */
export async function eliminarMatriculado(id: number): Promise<void> {
  await apiRequest(`/admin/matriculados/${id}`, {
    method: "DELETE",
  })
}
