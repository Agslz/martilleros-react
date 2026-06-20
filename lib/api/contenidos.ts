import { cache } from "react"
import { API_BASE_URL } from "./config"
import type { ContenidoKey, ContenidoResponse } from "./types"
import type { ApiResponse } from "./types"

const FETCH_TIMEOUT_MS = 8_000

function isApiUnreachable(error: unknown): boolean {
  if (!(error instanceof Error)) return true
  const msg = error.message.toLowerCase()
  const cause =
    error.cause instanceof Error ? error.cause.message.toLowerCase() : ""
  return (
    msg.includes("fetch failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    cause.includes("econnrefused") ||
    cause.includes("enotfound") ||
    cause.includes("etimedout")
  )
}

async function fetchContenido(
  key: ContenidoKey
): Promise<ContenidoResponse | null> {
  const url = `${API_BASE_URL}/public/contenidos/${key}`

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!response.ok) return null

    const json = (await response.json()) as ApiResponse<ContenidoResponse>
    if (json.success && json.data) return json.data
    return null
  } catch (error) {
    if (process.env.NODE_ENV === "development" && isApiUnreachable(error)) {
      console.warn(
        `[contenidos] No se pudo cargar "${key}" (${url}). ` +
          "¿Está el backend en marcha? Se usa contenido por defecto en el footer."
      )
    } else if (process.env.NODE_ENV !== "development") {
      console.error(`Error al obtener contenido ${key}:`, error)
    }
    return null
  }
}

/** Misma petición deduplicada por request (layout + página de contacto). */
export const getContenido = cache(fetchContenido)
