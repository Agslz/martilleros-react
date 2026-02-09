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

export interface InitPointResponse {
  initPoint?: string
  [key: string]: unknown
}

export async function pagarCupon(
  periodo: string // YYYY-MM
): Promise<InitPointResponse | null> {
  try {
    const res = await apiRequest<InitPointResponse>(
      `/private/cuotas/${periodo}/pagar-cupon`,
      { method: "POST" }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al solicitar cupón:", e)
    throw e
  }
}

export async function crearSuscripcionCuota(body?: {
  monto?: number
  descripcion?: string
}): Promise<InitPointResponse | null> {
  try {
    const res = await apiRequest<InitPointResponse>(
      "/private/cuotas/suscripcion",
      {
        method: "POST",
        body: JSON.stringify(body ?? {}),
      }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear suscripción:", e)
    throw e
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
