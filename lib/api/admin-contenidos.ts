import { apiRequest } from "./client"
import type { ContenidoKey, ContenidoRequest, ContenidoResponse } from "./types"

export async function actualizarContenido(
  key: ContenidoKey,
  body: ContenidoRequest
): Promise<ContenidoResponse | null> {
  try {
    const res = await apiRequest<ContenidoResponse>(
      `/admin/contenidos/${key}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al actualizar contenido:", e)
    throw e
  }
}
