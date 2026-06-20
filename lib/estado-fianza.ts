import type { EstadoFianza } from "@/lib/api/types"

const ETIQUETAS_ESTADO_FIANZA: Record<EstadoFianza, string> = {
  ACTIVA: "Activa",
  VENCIDA: "Vencida",
  PENDIENTE: "Pendiente",
  NO_REQUERIDA: "No requerida",
}

export function etiquetaEstadoFianza(estado: EstadoFianza): string {
  return ETIQUETAS_ESTADO_FIANZA[estado] ?? estado
}

/** Misma regla que el backend para `puedeEjercer` en listados públicos. */
export function matriculaPuedeEjercer(matriculado: {
  habilitado: boolean
  estadoFianza: EstadoFianza
}): boolean {
  return matriculado.habilitado && matriculado.estadoFianza === "ACTIVA"
}
