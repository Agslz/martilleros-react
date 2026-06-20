const LOCAL_API = "http://127.0.0.1:8080/api"

function normalizeApiBase(url: string): string {
  return url.replace(/\/$/, "")
}

/**
 * URL base de la API del backend (Colegio de Martilleros).
 *
 * Producción (elegir una opción):
 * 1. Proxy same-origin (recomendado si el front también está en Railway):
 *    BACKEND_URL=http://colegiodemartilleros.railway.internal:8080
 *    (sin NEXT_PUBLIC_API_URL → el navegador usa /api y Next reenvía al backend)
 *
 * 2. URL pública directa (Vercel u otro hosting):
 *    NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api
 *
 * No usar *.railway.internal en NEXT_PUBLIC_*: el navegador no puede resolver esa red.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (fromEnv) return normalizeApiBase(fromEnv)

  if (process.env.NODE_ENV === "production") {
    return "/api"
  }

  return LOCAL_API
}

export const API_BASE_URL = getApiBaseUrl()

/** true si el front en producción sigue apuntando a localhost (mal configurado). */
export function isApiMisconfiguredInBrowser(): boolean {
  if (typeof window === "undefined") return false

  const host = window.location.hostname
  const isLocalFront = host === "localhost" || host === "127.0.0.1"
  if (isLocalFront) return false

  return (
    API_BASE_URL.includes("127.0.0.1") ||
    API_BASE_URL.includes("localhost") ||
    API_BASE_URL.includes(".railway.internal")
  )
}

export function getApiConnectionErrorMessage(): string {
  if (isApiMisconfiguredInBrowser()) {
    if (API_BASE_URL.includes(".railway.internal")) {
      return (
        "La URL del backend está mal configurada: *.railway.internal solo funciona " +
        "entre servicios en Railway, no desde el navegador. Definí BACKEND_URL en el " +
        "servicio del front (proxy) o NEXT_PUBLIC_API_URL con la URL pública del backend."
      )
    }

    return (
      "La API apunta a localhost en producción. Configurá NEXT_PUBLIC_API_URL con la " +
      "URL pública del backend en Railway (ej. https://….up.railway.app/api) o BACKEND_URL " +
      "con la red interna si el front también está en Railway, y volvé a desplegar."
    )
  }

  return "Error al conectar con el backend. Verificá que esté en marcha y accesible."
}
