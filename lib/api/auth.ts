import { apiRequest } from "./client"
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  UserInfoResponse,
  OlvideContrasenaRequest,
  CompletarPerfilRequest,
  CambiarContrasenaRequest,
  ActualizarPerfilRequest,
} from "./types"

export async function login(
  matricula: string,
  password: string
): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ matricula, password } as LoginRequest),
    auth: false,
  })
}

export async function olvideContrasena(
  matricula: string
): Promise<ApiResponse<unknown>> {
  return apiRequest<unknown>("/auth/olvide-contrasena", {
    method: "POST",
    body: JSON.stringify({ matricula } as OlvideContrasenaRequest),
    auth: false,
  })
}

export async function completarPerfil(
  body: CompletarPerfilRequest
): Promise<ApiResponse<unknown>> {
  return apiRequest<unknown>("/auth/completar-perfil", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  })
}

export async function cambiarContrasena(
  body: CambiarContrasenaRequest
): Promise<ApiResponse<unknown>> {
  return apiRequest<unknown>("/auth/cambiar-contrasena", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  })
}

/** PUT /auth/me - Actualizar nombre, apellido, email, cuit del usuario logueado. */
export async function actualizarPerfil(
  body: ActualizarPerfilRequest
): Promise<ApiResponse<UserInfoResponse>> {
  return apiRequest<UserInfoResponse>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(body),
    auth: true,
  })
}

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export async function getCurrentUser(): Promise<UserInfoResponse | null> {
  try {
    const res = await apiRequest<UserInfoResponse>("/auth/me")
    if (res.success && res.data) return res.data
    return null
  } catch {
    return null
  }
}
