/**
 * URL base de la API del backend (Colegio de Martilleros).
 * En producción definir NEXT_PUBLIC_API_URL en .env.local
 * (en Windows/local preferir 127.0.0.1 en lugar de localhost).
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8080/api") as string
