import { apiRequest } from "./client"
import type { CrearMatriculadoRequest } from "./types"

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
