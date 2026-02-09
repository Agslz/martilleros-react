import { apiRequest } from "./client"
import type { EstadoMatriculadoResponse } from "./types"

export async function getEstadoMatriculado(): Promise<EstadoMatriculadoResponse | null> {
  try {
    const res = await apiRequest<EstadoMatriculadoResponse>(
      "/private/matriculados/estado"
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    const err = e as Error & { status?: number; data?: { message?: string } }
    const isNotFound =
      err?.status === 404 ||
      err?.data?.message?.toLowerCase().includes("no encontrado")
    if (!isNotFound) {
      console.error("Error al obtener estado matriculado:", e)
    }
    return null
  }
}
