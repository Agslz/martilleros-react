import { apiRequest } from "./client"
import type {
  MatriculadoPublicResponse,
  VerificacionCuotaPublicResponse,
} from "./types"

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

/** GET /public/matriculados/{id}/verificar-cuota — cartel al escanear el QR. */
export async function getVerificacionCuotaPublica(
  id: number
): Promise<VerificacionCuotaPublicResponse> {
  const res = await apiRequest<VerificacionCuotaPublicResponse>(
    `/public/matriculados/${id}/verificar-cuota`,
    { auth: false }
  )
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "No se pudo verificar el socio")
  }
  return res.data
}
