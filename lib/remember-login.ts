const REMEMBER_PREF_KEY = "loginRemember"
const REMEMBER_MATRICULA_KEY = "loginMatricula"

export function loadRememberedLogin(): { remember: boolean; matricula: string } {
  if (typeof window === "undefined") {
    return { remember: false, matricula: "" }
  }
  const remember = localStorage.getItem(REMEMBER_PREF_KEY) === "true"
  const matricula = remember
    ? localStorage.getItem(REMEMBER_MATRICULA_KEY) ?? ""
    : ""
  return { remember, matricula }
}

export function persistRememberedLogin(
  remember: boolean,
  matricula: string
): void {
  if (typeof window === "undefined") return
  if (remember) {
    localStorage.setItem(REMEMBER_PREF_KEY, "true")
    localStorage.setItem(REMEMBER_MATRICULA_KEY, matricula.trim())
  } else {
    localStorage.removeItem(REMEMBER_PREF_KEY)
    localStorage.removeItem(REMEMBER_MATRICULA_KEY)
  }
}

/** Ruta del área privada según rol, o login si no hay sesión. */
export function getPrivateAreaPath(
  role: "ADMIN" | "MATRICULADO" | undefined,
  primeraVezLogin?: boolean
): string {
  if (!role) return "/login"
  if (role === "ADMIN") return "/admin"
  if (primeraVezLogin) return "/completar-perfil"
  return "/panel"
}
