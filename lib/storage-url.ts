import { API_BASE_URL } from "@/lib/api/config"

/** URL absoluta (S3, CDN, etc.) o ruta relativa que el backend guarda en local. */
export function isAbsoluteStorageUrl(ref: string): boolean {
  return /^https?:\/\//i.test(ref.trim())
}

/**
 * API apuntando a localhost → storage LOCAL y endpoint /api/dev/files disponible.
 */
export function isLocalStorageApi(): boolean {
  try {
    const host = new URL(API_BASE_URL).hostname
    return host === "localhost" || host === "127.0.0.1"
  } catch {
    return /localhost|127\.0\.0\.1/i.test(API_BASE_URL)
  }
}

/**
 * Convierte `constanciaUrl` / `fileUrl` del backend en URL abrible en el navegador.
 *
 * - Producción (S3): el backend debe devolver URL absoluta → se usa tal cual.
 * - Local: ruta relativa (ej. `fianzas/archivo.pdf`) → `/api/dev/files/...`.
 * - Ruta relativa en producción: no hay `/dev/files` → devuelve `null`.
 */
export function resolveStorageFileUrl(fileRef: string | null | undefined): string | null {
  const ref = fileRef?.trim()
  if (!ref) return null

  if (isAbsoluteStorageUrl(ref)) return ref

  if (!isLocalStorageApi()) return null

  const path = ref.replace(/^\//, "")
  const origin = API_BASE_URL.replace(/\/api\/?$/i, "")
  return `${origin}/api/dev/files/${path}`
}
