const TOKEN_KEY = "token"

/**
 * Guarda el JWT. Con `persist=true` (Recordarme) usa localStorage; si no, sessionStorage.
 */
export function saveToken(token: string, persist = true): void {
  if (typeof window === "undefined") return
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token)
    sessionStorage.removeItem(TOKEN_KEY)
  } else {
    sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function removeToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return (
    sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
  )
}
