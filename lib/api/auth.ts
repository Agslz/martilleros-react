import { apiRequest } from "./client"
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  UserInfoResponse,
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
