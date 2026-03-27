import { apiRequest } from "./client"
import type { PagoRequest, PagoResponse } from "./types"

export async function getPagos(): Promise<PagoResponse[]> {
  try {
    const res = await apiRequest<PagoResponse[]>("/private/pagos")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    const err = e as Error & { data?: { message?: string } }
    const msg = err?.data?.message ?? err.message ?? ""
    const isMatriculadoNoEncontrado =
      typeof msg === "string" && msg.toLowerCase().includes("matriculado no encontrado")

    // Solo logueamos en consola si es un error inesperado;
    // para "Matriculado no encontrado" dejamos que lo maneje la UI sin ruido.
    if (!isMatriculadoNoEncontrado) {
      // eslint-disable-next-line no-console
      console.error("Error al obtener pagos:", e)
    }

    throw err
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
