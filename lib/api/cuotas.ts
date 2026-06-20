import { apiRequest } from "./client"
import type {
  CuotaItemResponse,
  CuotaPeriodoRequest,
  CuotaEstadoItemResponse,
} from "./types"

export async function getCuotas(): Promise<CuotaItemResponse[]> {
  try {
    const res = await apiRequest<CuotaItemResponse[]>("/private/cuotas")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener cuotas:", e)
    return []
  }
}

// --- Admin ---
export async function crearPeriodoCuota(
  body: CuotaPeriodoRequest
): Promise<unknown> {
  try {
    const res = await apiRequest<unknown>("/admin/cuotas/periodos", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (res.success) return res.data
    return null
  } catch (e) {
    console.error("Error al crear período cuota:", e)
    throw e
  }
}

export async function getEstadoCuotasPorPeriodo(
  periodo: string // YYYY-MM
): Promise<CuotaEstadoItemResponse[]> {
  try {
    const res = await apiRequest<CuotaEstadoItemResponse[]>(
      `/admin/cuotas/estado?periodo=${encodeURIComponent(periodo)}`
    )
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener estado cuotas:", e)
    return []
  }
}
