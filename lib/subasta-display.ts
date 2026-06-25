import type { SubastaResponse } from "@/lib/api/types"

export function hoyIso(): string {
  return new Date().toISOString().slice(0, 10)
}

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

/** Externas: fechaFin >= hoy. Matriculados: alguna fecha de boletín >= hoy. */
export function edictoTienePublicacionesPendientes(
  subasta: SubastaResponse,
  today = hoyIso()
): boolean {
  if (subasta.esPublicacionExterna) {
    return (subasta.fechaFin ?? "") >= today
  }
  return getFechasBoletin(subasta).some((f) => f >= today)
}

/** Texto de fechas para listados (matriculados: días BO; externas: rango). */
export function formatFechasEdictoListado(subasta: SubastaResponse): string {
  if (subasta.esPublicacionExterna && subasta.fechaInicio && subasta.fechaFin) {
    return `${formatFechaCorta(subasta.fechaInicio)} – ${formatFechaCorta(subasta.fechaFin)}`
  }
  const fechas = getFechasBoletin(subasta)
  if (fechas.length === 0) return "—"
  return formatFechasBoletinLista(fechas)
}

function formatFechaCorta(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}
