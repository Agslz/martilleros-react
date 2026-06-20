"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  getAdminInactivityTimeoutMinutes,
  setAdminLogoutMessage,
} from "@/lib/admin-session"
import { endClientSession } from "@/lib/auth-session"
import { useToast } from "@/hooks/use-toast"

const WARN_BEFORE_MS = 5 * 60 * 1000

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
    const warnMs = Math.max(0, totalMs - WARN_BEFORE_MS)

    warnTimeoutRef.current = setTimeout(() => {
      if (warnShownRef.current) return
      warnShownRef.current = true
      toast({
        title: "Sesión por vencer",
        description:
          "Por inactividad, el panel se cerrará en unos 5 minutos. Mueva el mouse o use el panel para mantener la sesión.",
        duration: 12000,
      })
    }, warnMs)

    expireTimeoutRef.current = setTimeout(() => {
      void expireSession()
    }, totalMs)
  }, [clearTimers, expireSession, toast])

  useEffect(() => {
    const onActivity = () => scheduleTimers()
    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const

    events.forEach((name) => window.addEventListener(name, onActivity))
    window.addEventListener("admin-session-activity", onActivity)
    scheduleTimers()

    return () => {
      events.forEach((name) => window.removeEventListener(name, onActivity))
      window.removeEventListener("admin-session-activity", onActivity)
      clearTimers()
    }
  }, [scheduleTimers, clearTimers])

  return null
}
