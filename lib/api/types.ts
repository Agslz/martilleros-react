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

export interface AdminLoginRequest extends LoginRequest {
  force?: boolean
}

export interface AdminSessionInfo {
  ocupado: boolean
  inactivityTimeoutMinutes: number
}

export interface LoginResponse {
  token: string
  matricula: string
  nombre: string
  apellido: string
  email?: string | null
  telefono?: string | null
  fotoCarnetUrl?: string | null
  role: "ADMIN" | "MATRICULADO"
  primeraVezLogin: boolean
  adminInactivityTimeoutMinutes?: number
  adminSessionExpiresAt?: string
}

export type UserInfoResponse = Omit<LoginResponse, "token"> & { cuit?: string }

/** PUT /auth/me (Bearer) - Actualizar datos del perfil del usuario logueado */
export interface ActualizarPerfilRequest {
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  cuit?: string
}

/** POST /auth/olvide-contrasena */
export interface OlvideContrasenaRequest {
  matricula: string
}

/** Longitud mínima de contraseña (backend @Size(min = 8)). */
export const AUTH_PASSWORD_MIN_LENGTH = 8

/** POST /auth/completar-perfil (Bearer) — primer login */
export interface CompletarPerfilRequest {
  email: string
  contrasenaActual: string
  nuevaContrasena: string
  cuit?: string
  telefono?: string
}

/** POST /auth/cambiar-contrasena (Bearer) */
export interface CambiarContrasenaRequest {
  contrasenaActual: string
  nuevaContrasena: string
}

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
  fechaInicio: string | null
  fechaFin: string | null
  edictoUrl: string
  fechaPublicacion: string
  visiblePublico: boolean
  createdAt: string
  imagenes: ImagenSubastaResponse[]
  edictoTexto?: string
  numeroEdicto?: string
  /** @deprecated usar fechasPublicacionBoletin */
  fechaPublicacionBoletin?: string
  fechasPublicacionBoletin?: string[]
  cantidadPublicaciones?: number
  telefonoMartillero?: string | null
  modificablePorAdmin?: boolean
  esPublicacionExterna: boolean
}

// --- Contenidos ---
export type ContenidoKey = "HOME" | "CONTACTO"

export interface ContenidoResponse {
  key: string
  titulo: string
  cuerpo: string
  updatedAt: string
}

// --- Matriculados (público / privado) ---
export type EstadoFianza =
  | "ACTIVA"
  | "VENCIDA"
  | "PENDIENTE"
  | "RECHAZADA"
  | "NO_REQUERIDA"

export interface MatriculadoPublicResponse {
  id: number
  nombre: string
  apellido: string
  matricula: string
  email?: string | null
  telefono?: string | null
  cuit?: string
  fotoCarnetUrl?: string
  habilitado: boolean
  estadoFianza: EstadoFianza
}

// --- Subastas: publicación externa (admin, terceros no matriculados) ---
export interface CrearSubastaExternaRequest {
  titulo: string
  descripcion: string
  precioInicial: number
  martilleroACargo: string
  nombreMartillero: string
  cuitMartillero: string
  domicilio: string
  fechaInicio: string
  fechaFin: string
  edictoTexto: string
  numeroEdicto: string
  fechaPublicacionBoletin: string
}

export type ActualizarSubastaExternaRequest = CrearSubastaExternaRequest

// --- Subastas: matriculado (POST /api/private/subastas) ---
export interface CrearSubastaMatriculadoRequest {
  titulo: string
  descripcion: string
  precioInicial: number
  domicilio: string
  edictoTexto?: string
  numeroEdicto?: string
  fechasPublicacionBoletin: string[]
}

export interface FileUploadResponse {
  fileName: string
  fileUrl: string
  fileSize?: number
  contentType?: string
}

// --- Biblioteca ---
export interface DocumentoBibliotecaRequest {
  titulo: string
  descripcion?: string
  fileName: string
  fileUrl: string
  visibleParaMatriculados?: boolean
}

export interface DocumentoBibliotecaResponse {
  id: number
  titulo: string
  descripcion?: string
  fileName: string
  fileUrl: string
  visibleParaMatriculados: boolean
  createdAt: string
}

/** GET /api/private/matriculados/estado */
export interface EstadoMatriculadoResponse {
  nombre: string
  apellido: string
  matricula: string
  habilitado: boolean
  estadoFianza: EstadoFianza
  puedeEjercer: boolean
  fotoCarnetUrl?: string | null
}

export interface CrearMatriculadoRequest {
  nombre: string
  apellido: string
  dni: string
  matricula: string
  email: string
  cuit: string
  telefono?: string
}

// --- Fianzas ---
export interface FianzaResponse {
  id: number
  matriculadoId: number
  constanciaUrl: string
  fechaInicio: string
  fechaVencimiento: string
  createdAt: string
  estado: EstadoFianza
}

/** Fianza pendiente de verificación para el panel admin (incluye datos del matriculado). */
export interface FianzaPendienteAdminResponse {
  id: number
  matriculadoId: number
  constanciaUrl: string
  fechaInicio: string
  fechaVencimiento: string
  createdAt: string
  matricula: string
  nombre: string
  apellido: string
  email?: string
}

// --- Contenidos (admin) ---
export interface ContenidoRequest {
  titulo: string
  cuerpo: string
}

// --- Cuotas ---
export type EstadoCuota = "PENDIENTE" | "PAGADO" | "VENCIDO"

export interface CuotaItemResponse {
  periodo: string // YYYY-MM
  monto: number
  fechaVencimiento: string
  estado: EstadoCuota
  metodoPago?: string
  paidAt?: string
}

export interface CuotaPeriodoRequest {
  periodo: string // YYYY-MM
  monto: number
  fechaVencimiento: string // YYYY-MM-DD
}

export interface CuotaEstadoItemResponse {
  matricula: string
  nombre?: string
  apellido?: string
  estado: EstadoCuota
  paidAt?: string
}
