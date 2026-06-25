/** true si es sábado (6) o domingo (0). */
export function esFinDeSemana(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function fechaToIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function isoToDate(iso: string): Date {
  return new Date(iso + "T12:00:00")
}

export function fechasIsoToDates(fechas: string[]): Date[] {
  return fechas.map(isoToDate)
}

export function fechasDatesToIso(dates: Date[]): string[] {
  return [...new Set(dates.map(fechaToIso))].sort()
}
