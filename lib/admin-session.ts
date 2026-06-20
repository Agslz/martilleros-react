import type { LoginResponse } from "@/lib/api/types"

const ADMIN_TIMEOUT_KEY = "adminInactivityTimeoutMinutes"
const ADMIN_EXPIRES_KEY = "adminSessionExpiresAt"
const SESSION_ROLE_KEY = "sessionRole"
const ADMIN_LOGOUT_MSG_KEY = "adminLogoutMessage"

const DEFAULT_INACTIVITY_MINUTES = 30

export function saveAdminLoginSession(data: LoginResponse): void {
  if (typeof window === "undefined" || data.role !== "ADMIN") return
  const minutes =
    data.adminInactivityTimeoutMinutes ?? DEFAULT_INACTIVITY_MINUTES
  localStorage.setItem(ADMIN_TIMEOUT_KEY, String(minutes))
  if (data.adminSessionExpiresAt) {
    localStorage.setItem(ADMIN_EXPIRES_KEY, data.adminSessionExpiresAt)
  } else {
    localStorage.removeItem(ADMIN_EXPIRES_KEY)
  }
  localStorage.setItem(SESSION_ROLE_KEY, "ADMIN")
}

export function saveMatriculadoLoginSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_TIMEOUT_KEY)
  localStorage.removeItem(ADMIN_EXPIRES_KEY)
  localStorage.setItem(SESSION_ROLE_KEY, "MATRICULADO")
}

export function clearAdminLoginSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_TIMEOUT_KEY)
  localStorage.removeItem(ADMIN_EXPIRES_KEY)
  localStorage.removeItem(SESSION_ROLE_KEY)
}

export function getAdminInactivityTimeoutMinutes(): number {
  if (typeof window === "undefined") return DEFAULT_INACTIVITY_MINUTES
  const raw = localStorage.getItem(ADMIN_TIMEOUT_KEY)
  const n = raw ? Number(raw) : DEFAULT_INACTIVITY_MINUTES
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_INACTIVITY_MINUTES
}

export function isAdminSessionRole(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(SESSION_ROLE_KEY) === "ADMIN"
}

export function setAdminLogoutMessage(message: string): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(ADMIN_LOGOUT_MSG_KEY, message)
}

export function consumeAdminLogoutMessage(): string | null {
  if (typeof window === "undefined") return null
  const message = sessionStorage.getItem(ADMIN_LOGOUT_MSG_KEY)
  if (message) sessionStorage.removeItem(ADMIN_LOGOUT_MSG_KEY)
  return message
}

export function notifyAdminSessionActivity(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event("admin-session-activity"))
}
