/**
 * URL base de la API del backend (Colegio de Martilleros).
 * En producción definir NEXT_PUBLIC_API_URL en .env.local
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api") as string
