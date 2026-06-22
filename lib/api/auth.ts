import { apiRequest } from "./client"
import type {
  ApiResponse,
  AdminLoginRequest,
  AdminSessionInfo,
  LoginResponse,
  UserInfoResponse,
  OlvideContrasenaRequest,
  CompletarPerfilRequest,
  CambiarContrasenaRequest,
  ActualizarPerfilRequest,
} from "./types"

/** Reexportado desde token.ts para compatibilidad. */
export { saveToken, removeToken, getToken } from "./token"

/** GET /auth/admin/sesion — sin token; indica si el panel admin está ocupado. */
export async function getAdminSessionInfo(): Promise<AdminSessionInfo | null> {
  try {
    const res = await apiRequest<AdminSessionInfo>("/auth/admin/sesion", {
      auth: false,
    })
    if (res.success && res.data) return res.data
    return null
  } catch {
    return null
  }
}

export async function login(
  matricula: string,
  password: string,
  options?: { force?: boolean }
): Promise<ApiResponse<LoginResponse>> {
  const body: AdminLoginRequest = { matricula, password }
  if (options?.force) body.force = true

  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  })
}

/** POST /auth/logout — obligatorio al salir del panel admin. */
export async function logout(): Promise<void> {
  try {
    await apiRequest<unknown>("/auth/logout", {
      method: "POST",
      auth: true,
    })
  } catch {
    // Si el token ya venció, igual limpiamos en el cliente.
  }
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

export async function getCurrentUser(): Promise<UserInfoResponse | null> {
  try {
    const res = await apiRequest<UserInfoResponse>("/auth/me")
    if (res.success && res.data) return res.data
    return null
  } catch {
    return null
  }
}
