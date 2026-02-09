import { apiRequest } from "./client"
import type { PagoRequest, PagoResponse } from "./types"

export async function getPagos(): Promise<PagoResponse[]> {
  try {
    const res = await apiRequest<PagoResponse[]>("/private/pagos")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener pagos:", e)
    return []
  }
}

export async function getPagoById(id: number): Promise<PagoResponse | null> {
  try {
    const res = await apiRequest<PagoResponse>(`/private/pagos/${id}`)
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al obtener pago:", e)
    return null
  }
}

export async function crearPago(
  body: PagoRequest
): Promise<PagoResponse | null> {
  try {
    const res = await apiRequest<PagoResponse>("/private/pagos", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear pago:", e)
    throw e
  }
}
