import { API_BASE_URL } from "./config"
import type { ApiResponse } from "./types"
import {
  clearAdminLoginSession,
  isAdminSessionRole,
  notifyAdminSessionActivity,
  setAdminLogoutMessage,
} from "@/lib/admin-session"

const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export interface ApiClientOptions extends RequestInit {
  /** Si es false, no se envía el header Authorization (por defecto true) */
  auth?: boolean
}

async function tryAdminLogoutOn401(): Promise<void> {
  const token = getToken()
  if (!token) return
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // ignorar
  }
}

function handleUnauthorized(message?: string): never {
  const onAdminRoute =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin")
  const isAdmin =
    onAdminRoute || isAdminSessionRole()

  if (isAdmin && typeof window !== "undefined") {
    void tryAdminLogoutOn401()
    clearAdminLoginSession()
    setAdminLogoutMessage(
      message ??
        "La sesión del panel finalizó. Inicie sesión nuevamente."
    )
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login"
    }
  }

  const err = new Error(message ?? "Unauthorized") as Error & {
    status?: number
    data?: ApiResponse<unknown>
  }
  err.status = 401
  throw err
}

/**
 * Cliente HTTP para la API del backend.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { auth = true, headers: optHeaders, ...rest } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...optHeaders,
  }

  if (auth) {
    const token = getToken()
    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
  let response: Response
  try {
    response = await fetch(url, {
      ...rest,
      headers,
    })
  } catch (fetchError) {
    const msg =
      fetchError instanceof Error ? fetchError.message : "Error de red"
    const cause =
      fetchError instanceof Error &&
      fetchError.cause instanceof Error
        ? fetchError.cause.message
        : ""
    const isNetwork =
      msg === "Failed to fetch" ||
      msg === "fetch failed" ||
      msg.includes("NetworkError") ||
      cause.includes("ECONNREFUSED") ||
      cause.includes("ENOTFOUND")
    const hint = isNetwork
      ? " (¿Backend encendido en " +
        API_BASE_URL.replace(/\/api\/?$/, "") +
        "?)"
      : ""
    throw new Error(msg + hint)
  }

  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>

  if (response.status === 401 && typeof window !== "undefined") {
    handleUnauthorized(data?.message)
  }

  if (!response.ok) {
    const err = new Error(data?.message ?? `HTTP ${response.status}`) as Error & {
      status: number
      data: ApiResponse<T>
    }
    err.status = response.status
    err.data = data
    throw err
  }

  if (
    typeof window !== "undefined" &&
    auth &&
    window.location.pathname.startsWith("/admin")
  ) {
    notifyAdminSessionActivity()
  }

  return data
}

/**
 * Petición con FormData (no envía Content-Type; el navegador lo fija con boundary).
 */
export async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  options: Omit<ApiClientOptions, "body" | "headers"> & { auth?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { auth = true, ...rest } = options
  const token = getToken()
  const headers: HeadersInit = {}
  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers,
    ...rest,
  })

  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>

  if (response.status === 401 && typeof window !== "undefined") {
    handleUnauthorized(data?.message)
  }

  if (!response.ok) {
    const err = new Error(data?.message ?? `HTTP ${response.status}`) as Error & {
      status: number
      data: ApiResponse<T>
    }
    err.status = response.status
    err.data = data
    throw err
  }

  if (
    typeof window !== "undefined" &&
    auth &&
    window.location.pathname.startsWith("/admin")
  ) {
    notifyAdminSessionActivity()
  }

  return data
}
