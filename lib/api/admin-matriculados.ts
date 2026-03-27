import { apiRequest } from "./client"
import type { CrearMatriculadoRequest } from "./types"
import type { MatriculadoPublicResponse } from "./types"

export interface CrearMatriculadoResponse {
  id: number
  matricula: string
  nombre: string
  apellido: string
  email?: string
  password?: string // Solo en respuesta al crear
  [key: string]: unknown
}

export async function crearMatriculado(
  body: CrearMatriculadoRequest
): Promise<CrearMatriculadoResponse | null> {
  try {
    const res = await apiRequest<CrearMatriculadoResponse>(
      "/admin/matriculados",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear matriculado:", e)
    throw e
  }
}

/**
 * Lista todos los matriculados para el panel admin (incluye habilitado y estadoFianza).
 * Requiere GET /api/admin/matriculados en el backend.
 */
export async function getMatriculadosAdmin(): Promise<MatriculadoPublicResponse[]> {
  const res = await apiRequest<MatriculadoPublicResponse[]>(
    "/admin/matriculados",
    { method: "GET" }
  )
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
