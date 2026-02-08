/**
 * Respuesta estándar de la API del backend.
 */
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string>
  timestamp: string
}

// --- Auth ---
export interface LoginRequest {
  matricula: string
  password: string
}

export interface LoginResponse {
  token: string
  matricula: string
  nombre: string
  apellido: string
  email?: string
  role: "ADMIN" | "MATRICULADO"
  primeraVezLogin: boolean
}

export type UserInfoResponse = Omit<LoginResponse, "token">

// --- Subastas ---
export interface ImagenSubastaResponse {
  id: number
  fileName: string
  fileUrl: string
  orden: number
}

export interface SubastaResponse {
  id: number
  titulo: string
  descripcion: string
  precioInicial: number
  martilleroACargo: string
  nombreMartillero: string
  cuitMartillero: string
  domicilio: string
  fechaInicio: string
  fechaFin: string
  edictoUrl?: string
  fechaPublicacion?: string
  visiblePublico: boolean
  createdAt: string
  imagenes: ImagenSubastaResponse[]
}

// --- Contenidos ---
export type ContenidoKey = "HOME" | "CONTACTO" | "DIRECCIONES" | "TEXTOS"

export interface ContenidoResponse {
  key: string
  titulo: string
  cuerpo: string
  updatedAt: string
}

// --- Matriculados (público) ---
export interface MatriculadoPublicResponse {
  id: number
  nombre: string
  apellido: string
  matricula: string
  email?: string
  cuit?: string
  habilitado: boolean
  estadoFianza: "ACTIVA" | "VENCIDA" | "PENDIENTE"
}
