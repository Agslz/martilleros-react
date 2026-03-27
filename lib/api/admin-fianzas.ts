import { apiRequest } from "./client"
import type { FianzaPendienteAdminResponse } from "./types"

/**
 * Lista fianzas pendientes de verificación para el admin.
 * Requiere GET /api/admin/fianzas/pendientes en el backend.
 */
export async function getFianzasPendientesAdmin(): Promise<
  FianzaPendienteAdminResponse[]
> {
  const res = await apiRequest<FianzaPendienteAdminResponse[]>(
    "/admin/fianzas/pendientes",
    { method: "GET" }
  )
  if (res.success && Array.isArray(res.data)) return res.data
  return []
}

/**
 * Aprueba una fianza y habilita al matriculado (estadoFianza ACTIVA).
 * Requiere POST /api/admin/fianzas/{id}/aprobar en el backend.
 */
export async function aprobarFianzaAdmin(id: number): Promise<void> {
  await apiRequest(`/admin/fianzas/${id}/aprobar`, {
    method: "POST",
  })
}

export interface NotificarRechazoFianzaRequest {
  mensaje: string
  camposIncorrectos?: string
}

/**
 * Envía correo al matriculado indicando rechazo o campos a corregir.
 * Requiere POST /api/admin/fianzas/{id}/notificar-rechazo en el backend.
 */
export async function notificarRechazoFianzaAdmin(
  id: number,
  body: NotificarRechazoFianzaRequest
): Promise<void> {
  await apiRequest(`/admin/fianzas/${id}/notificar-rechazo`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}
