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

export type UserInfoResponse = Omit<LoginResponse, "token"> & { cuit?: string }

/** PUT /auth/me (Bearer) - Actualizar datos del perfil del usuario logueado */
export interface ActualizarPerfilRequest {
  nombre: string
  apellido: string
  email?: string
  cuit?: string
}

/** POST /auth/olvide-contrasena */
export interface OlvideContrasenaRequest {
  matricula: string
}

/** POST /auth/completar-perfil (Bearer) */
export interface CompletarPerfilRequest {
  email: string
  password: string
  cuit?: string
}

/** POST /auth/cambiar-contrasena (Bearer) */
export interface CambiarContrasenaRequest {
  passwordActual: string
  passwordNueva: string
  passwordNuevaConfirmacion: string
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
  fechaInicio: string
  fechaFin: string
  edictoUrl?: string
  fechaPublicacion?: string
  visiblePublico: boolean
  createdAt: string
  imagenes: ImagenSubastaResponse[]
  edictoTexto?: string | null
  numeroEdicto?: string | null
  fechaPublicacionBoletin?: string | null
  urlBoletinOficial?: string | null
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

// --- Subastas (admin) ---
export interface SubastaRequest {
  titulo: string
  descripcion: string
  precioInicial: number
  martilleroACargo: string
  nombreMartillero: string
  cuitMartillero: string
  domicilio: string
  fechaInicio: string // YYYY-MM-DD
  fechaFin: string // YYYY-MM-DD
  edictoTexto?: string
  numeroEdicto?: string
  fechaPublicacionBoletin?: string // YYYY-MM-DD
  urlBoletinOficial?: string
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

// --- Matriculados (privado / admin) ---
export interface EstadoMatriculadoResponse {
  habilitado: boolean
  estadoFianza: "ACTIVA" | "VENCIDA" | "PENDIENTE"
  fechaVencimientoFianza?: string
  puedeEjercer: boolean
}

export interface CrearMatriculadoRequest {
  nombre: string
  apellido: string
  dni: string
  matricula: string
  email?: string
  cuit?: string
}

// --- Fianzas ---
export interface FianzaResponse {
  id: number
  matriculadoId: number
  constanciaUrl: string
  fechaInicio: string
  fechaVencimiento: string
  createdAt: string
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

// --- Pagos ---
export type TipoPago = "MATRICULA" | "CUOTA" | "OTRO"
export type EstadoPago = "PENDIENTE" | "PAGADO" | "CANCELADO"

export interface PagoRequest {
  tipoPago: TipoPago
  monto: number
  descripcion?: string
}

export interface PagoResponse {
  id: number
  matriculadoId: number
  tipoPago: TipoPago
  monto: number
  descripcion?: string
  estado: EstadoPago
  createdAt: string
  updatedAt: string
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
