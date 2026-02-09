import { apiRequest, apiRequestFormData } from "./client"
import type {
  DocumentoBibliotecaRequest,
  DocumentoBibliotecaResponse,
  FileUploadResponse,
} from "./types"

export async function getDocumentosBiblioteca(): Promise<
  DocumentoBibliotecaResponse[]
> {
  try {
    const res = await apiRequest<DocumentoBibliotecaResponse[]>(
      "/private/biblioteca"
    )
    if (res.success && Array.isArray(res.data)) return res.data
    return []
  } catch (e) {
    console.error("Error al obtener biblioteca:", e)
    return []
  }
}

export async function crearDocumentoBiblioteca(
  body: DocumentoBibliotecaRequest
): Promise<DocumentoBibliotecaResponse | null> {
  try {
    const res = await apiRequest<DocumentoBibliotecaResponse>(
      "/admin/biblioteca",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al crear documento:", e)
    throw e
  }
}

export async function actualizarDocumentoBiblioteca(
  id: number,
  body: DocumentoBibliotecaRequest
): Promise<DocumentoBibliotecaResponse | null> {
  try {
    const res = await apiRequest<DocumentoBibliotecaResponse>(
      `/admin/biblioteca/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al actualizar documento:", e)
    throw e
  }
}

export async function eliminarDocumentoBiblioteca(id: number): Promise<boolean> {
  try {
    const res = await apiRequest<void>(`/admin/biblioteca/${id}`, {
      method: "DELETE",
    })
    return res.success
  } catch (e) {
    console.error("Error al eliminar documento:", e)
    throw e
  }
}

export async function subirPdfBiblioteca(
  file: File
): Promise<FileUploadResponse | null> {
  if (file.type !== "application/pdf") {
    throw new Error("Solo se permiten archivos PDF")
  }
  const formData = new FormData()
  formData.append("file", file)
  try {
    const res = await apiRequestFormData<FileUploadResponse>(
      "/admin/biblioteca/upload",
      formData
    )
    if (res.success && res.data) return res.data
    return null
  } catch (e) {
    console.error("Error al subir PDF biblioteca:", e)
    throw e
  }
}
