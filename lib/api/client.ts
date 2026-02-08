import { API_BASE_URL } from "./config"
import type { ApiResponse } from "./types"

const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export interface ApiClientOptions extends RequestInit {
  /** Si es false, no se envía el header Authorization (por defecto true) */
  auth?: boolean
}

/**
 * Cliente HTTP para la API del backend.
 * Añade Authorization: Bearer cuando hay token y maneja 401 redirigiendo a /login.
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
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
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
    const hint =
      msg === "Failed to fetch" || msg.includes("NetworkError")
        ? " (¿Backend encendido en " +
          API_BASE_URL.replace("/api", "") +
          "? ¿CORS permite " +
          (typeof window !== "undefined" ? window.location.origin : "tu origen") +
          "?)"
        : ""
    throw new Error(msg + hint)
  }

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token")
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>
  if (!response.ok) {
    const err = new Error(data?.message ?? `HTTP ${response.status}`) as Error & {
      status: number
      data: ApiResponse<T>
    }
    err.status = response.status
    err.data = data
    throw err
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

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token")
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>
  if (!response.ok) {
    const err = new Error(data?.message ?? `HTTP ${response.status}`) as Error & {
      status: number
      data: ApiResponse<T>
    }
    err.status = response.status
    err.data = data
    throw err
  }

  return data
}