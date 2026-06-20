import { logout, removeToken } from "@/lib/api"
import { clearAdminLoginSession } from "@/lib/admin-session"

/** Cierra sesión en backend y limpia token / datos locales del panel. */
export async function endClientSession(): Promise<void> {
  await logout()
  clearAdminLoginSession()
  removeToken()
}
