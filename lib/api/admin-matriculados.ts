import { apiRequest, apiRequestFormData } from "./client"
import type { CrearMatriculadoRequest } from "./types"
import type { MatriculadoPublicResponse } from "./types"

export interface CrearMatriculadoResponse {
  id: number
  matricula: string
  nombre: string
  apellido: string
  email?: string
  fotoCarnetUrl?: string
  password?: string // Solo en respuesta al crear
  [key: string]: unknown
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
 * Requiere PUT /api/admin/matriculados/{id} en el backend con body { habilitado: boolean }.
 */
export async function updateMatriculadoHabilitado(
  id: number,
  habilitado: boolean
): Promise<void> {
  await apiRequest(`/admin/matriculados/${id}`, {
    method: "PUT",
    body: JSON.stringify({ habilitado }),
  })
}
