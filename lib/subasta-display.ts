import type { SubastaResponse } from "@/lib/api/types"

/** Fechas de publicación en boletín (compat con campo legacy). */
export function getFechasBoletin(subasta: SubastaResponse): string[] {
  if (
    Array.isArray(subasta.fechasPublicacionBoletin) &&
    subasta.fechasPublicacionBoletin.length > 0
  ) {
    return [...subasta.fechasPublicacionBoletin].sort()
  }
  if (subasta.fechaPublicacionBoletin?.trim()) {
    return [subasta.fechaPublicacionBoletin.trim()]
  }
  return []
}

export function getCantidadPublicaciones(subasta: SubastaResponse): number {
  if (typeof subasta.cantidadPublicaciones === "number") {
    return subasta.cantidadPublicaciones
  }
  return getFechasBoletin(subasta).length
}

export function esModificablePorAdmin(subasta: SubastaResponse): boolean {
  if (typeof subasta.modificablePorAdmin === "boolean") {
    return subasta.modificablePorAdmin
  }
  return subasta.esPublicacionExterna
}

export function formatFechasBoletinLista(fechas: string[]): string {
  return fechas
    .map((f) => {
      try {
        return new Date(f + "T12:00:00").toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      } catch {
        return f
      }
    })
    .join(", ")
}
