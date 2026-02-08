import { apiRequest } from "./client"
import type { ContenidoKey, ContenidoResponse } from "./types"

export async function getContenido(
  key: ContenidoKey
): Promise<ContenidoResponse | null> {
  try {
    const res = await apiRequest<ContenidoResponse>(
      `/public/contenidos/${key}`,
      { auth: false }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error(`Error al obtener contenido ${key}:`, e)
    return null
  }
}
