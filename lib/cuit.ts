/** Solo dígitos del CUIT (máx. 11). */
export function stripCuit(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11)
}

/** Formato visual xx-xxxxxxxx-x mientras el usuario escribe. */
export function formatCuitInput(value: string): string {
  const digits = stripCuit(value)
  if (digits.length <= 2) return digits
  if (digits.length <= 10) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`
  }
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
}

/** Muestra un CUIT almacenado (con o sin guiones). */
export function displayCuit(value: string | null | undefined): string {
  if (!value) return ""
  const digits = stripCuit(value)
  if (digits.length !== 11) return value
  return formatCuitInput(digits)
}

export function isValidCuit(value: string): boolean {
  return stripCuit(value).length === 11
}
