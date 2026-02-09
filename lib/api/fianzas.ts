import { apiRequest, apiRequestFormData } from "./client"
import type { FianzaResponse } from "./types"

export async function getFianzas(): Promise<FianzaResponse[]> {
  try {
    const res = await apiRequest<FianzaResponse[]>("/private/fianzas")
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener fianzas:", e)
    return []
  }
}

export async function getFianzaVigente(): Promise<FianzaResponse | null> {
  try {
    const res = await apiRequest<FianzaResponse>("/private/fianzas/vigente")
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al obtener fianza vigente:", e)
    return null
  }
}

export async function subirFianza(
  file: File,
  fechaInicio: string, // YYYY-MM-DD
  fechaVencimiento: string // YYYY-MM-DD
): Promise<FianzaResponse | null> {
  if (file.type !== "application/pdf") {
    throw new Error("Solo se permiten archivos PDF")
  }
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fechaInicio", fechaInicio)
  formData.append("fechaVencimiento", fechaVencimiento)
  try {
    const res = await apiRequestFormData<FianzaResponse>(
      "/private/fianzas",
      formData
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al subir fianza:", e)
    throw e
  }
}
