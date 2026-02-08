import { apiRequest } from "./client"
import type { MatriculadoPublicResponse } from "./types"

/**
 * Buscar matriculados (público). Si apellido está vacío, devuelve todos los habilitados.
 */
export async function getMatriculadosPublicos(
  apellido?: string
): Promise<MatriculadoPublicResponse[]> {
  try {
    const params = apellido
      ? `?apellido=${encodeURIComponent(apellido.trim())}`
      : ""
    const res = await apiRequest<MatriculadoPublicResponse[]>(
      `/public/matriculados${params}`,
      { auth: false }
    )
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al buscar matriculados:", e)
    return []
  }
}
