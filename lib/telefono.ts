/** Normaliza a solo dígitos y quita prefijo 15 si el usuario lo incluyó por error. */
export function stripTelefono(value: string): string {
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("15") && digits.length > 10) {
    digits = digits.slice(2)
  }
  return digits.slice(0, 11)
}

/** Une código de área + número para enviar al backend (ej. 2615120574). */
export function mergeTelefono(codigoArea: string, numero: string): string {
  return stripTelefono(`${codigoArea}${numero}`)
}

/** Separa teléfono almacenado en código de área (3) y resto. */
export function splitTelefono(
  telefono: string | null | undefined
): { codigoArea: string; numero: string } {
  const digits = stripTelefono(telefono ?? "")
  if (digits.length <= 3) {
    return { codigoArea: digits, numero: "" }
  }
  return {
    codigoArea: digits.slice(0, 3),
    numero: digits.slice(3),
  }
}

export function displayTelefono(telefono: string | null | undefined): string {
  const { codigoArea, numero } = splitTelefono(telefono)
  if (!codigoArea && !numero) return ""
  if (!numero) return codigoArea
  return `${codigoArea} ${numero}`
}

export function isValidTelefono(value: string): boolean {
  const digits = stripTelefono(value)
  return digits.length >= 10 && digits.length <= 11
}
