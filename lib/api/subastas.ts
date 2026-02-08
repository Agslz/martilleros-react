import { apiRequest } from "./client"
import type { SubastaResponse } from "./types"

/** Subastas públicas (sin auth) */
export async function getSubastasPublicas(): Promise<SubastaResponse[]> {
  try {
    const res = await apiRequest<SubastaResponse[]>("/public/subastas", {
      auth: false,
    })
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener subastas públicas:", e)
    return []
  }
}

/** Subastas públicas + privadas (requiere token) */
export async function getSubastasPrivadas(): Promise<SubastaResponse[]> {
  try {
    const res = await apiRequest<SubastaResponse[]>("/private/subastas")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener subastas:", e)
    return []
  }
}

/** Obtiene una subasta por id (desde la lista pública) */
export async function getSubastaById(
  id: number
): Promise<SubastaResponse | null> {
  const list = await getSubastasPublicas()
  return list.find((s) => s.id === id) ?? null
}
