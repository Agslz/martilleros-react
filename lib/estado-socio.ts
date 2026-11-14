import type { EstadoSocio } from "@/lib/api/types"

export const ESTADOS_SOCIO: EstadoSocio[] = [
  "SOCIO_AL_DIA",
  "SOCIO_CON_DEUDA",
  "SOCIO_DADO_DE_BAJA",
]

const ETIQUETAS: Record<EstadoSocio, string> = {
  SOCIO_AL_DIA: "Socio al día",
  SOCIO_CON_DEUDA: "Socio con deuda",
  SOCIO_DADO_DE_BAJA: "Socio dado de baja",
}

export function etiquetaEstadoSocio(estado?: EstadoSocio | null): string {
  if (!estado) return ETIQUETAS.SOCIO_AL_DIA
  return ETIQUETAS[estado] ?? estado
}

export function estadoSocioSeguro(estado?: EstadoSocio | null): EstadoSocio {
  return estado ?? "SOCIO_AL_DIA"
}
