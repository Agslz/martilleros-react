"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  getAdminInactivityTimeoutMinutes,
  setAdminLogoutMessage,
} from "@/lib/admin-session"
import { endClientSession } from "@/lib/auth-session"
import { useToast } from "@/hooks/use-toast"

/** Aviso al usuario antes del corte; se acota al 40% del timeout para timeouts cortos. */
function warnBeforeMs(totalMs: number): number {
  return Math.min(60_000, Math.floor(totalMs * 0.4))
}

export function AdminInactivityMonitor() {
  const { toast } = useToast()
  const warnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const expireTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnShownRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current)
    if (expireTimeoutRef.current) clearTimeout(expireTimeoutRef.current)
    warnTimeoutRef.current = null
    expireTimeoutRef.current = null
  }, [])

  const expireSession = useCallback(async () => {
    clearTimers()
    await endClientSession()
    setAdminLogoutMessage(
      "La sesión expiró por inactividad. Inicie sesión nuevamente."
    )
    window.location.href = "/login"
  }, [clearTimers])

  const scheduleTimers = useCallback(() => {
    clearTimers()
    warnShownRef.current = false

    const totalMs = getAdminInactivityTimeoutMinutes() * 60 * 1000
    const warnLeadMs = warnBeforeMs(totalMs)
    const warnMs = Math.max(0, totalMs - warnLeadMs)
    const warnSeconds = Math.max(1, Math.round(warnLeadMs / 1000))

    warnTimeoutRef.current = setTimeout(() => {
      if (warnShownRef.current) return
      warnShownRef.current = true
      toast({
        title: "Sesión por vencer",
        description:
          warnSeconds >= 60
            ? "Por inactividad, el panel se cerrará en unos minutos. Use el panel para mantener la sesión."
            : `Por inactividad, el panel se cerrará en unos ${warnSeconds} segundos. Use el panel para mantener la sesión.`,
        duration: 12000,
      })
    }, warnMs)

    expireTimeoutRef.current = setTimeout(() => {
      void expireSession()
    }, totalMs)
  }, [clearTimers, expireSession, toast])

  useEffect(() => {
    const onActivity = () => scheduleTimers()
    // Solo actividad real del panel (requests API), no mouse/teclado:
    // mover el mouse no renueva el lock en backend y dejaba la sesión “viva” en cliente.
    window.addEventListener("admin-session-activity", onActivity)
    scheduleTimers()

    return () => {
      window.removeEventListener("admin-session-activity", onActivity)
      clearTimers()
    }
  }, [scheduleTimers, clearTimers])

  return null
}
