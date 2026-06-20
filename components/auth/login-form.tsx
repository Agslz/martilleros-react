"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gavel, Eye, EyeOff, LogIn, Loader2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  getAdminSessionInfo,
  login,
  saveToken,
} from "@/lib/api"
import {
  consumeAdminLogoutMessage,
  saveAdminLoginSession,
  saveMatriculadoLoginSession,
} from "@/lib/admin-session"
import { useToast } from "@/hooks/use-toast"

const ADMIN_PANEL_OCCUPIED_MSG =
  "El panel de administración está siendo utilizado en este momento. Coordinen con la comisión e intenten más tarde."

export function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)
  const [adminPanelOcupado, setAdminPanelOcupado] = useState(false)
  const [login409, setLogin409] = useState(false)
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    remember: false,
  })

  const refreshAdminSessionStatus = async () => {
    const info = await getAdminSessionInfo()
    if (info) setAdminPanelOcupado(info.ocupado)
    return info
  }

  useEffect(() => {
    setSessionMessage(consumeAdminLogoutMessage())
    void refreshAdminSessionStatus()
  }, [])

  const completeLogin = (token: string, role: string, primeraVezLogin: boolean) => {
    saveToken(token)
    if (role === "ADMIN") {
      router.push("/admin")
    } else if (primeraVezLogin) {
      router.push("/completar-perfil")
    } else {
      router.push("/panel")
    }
  }

  const attemptLogin = async (force = false) => {
    setError(null)
    setLogin409(false)
    setLoading(true)
    try {
      const res = await login(formData.matricula, formData.password, { force })
      if (res.success && res.data) {
        if (res.data.role === "ADMIN") {
          saveAdminLoginSession(res.data)
          setAdminPanelOcupado(false)
        } else {
          saveMatriculadoLoginSession()
        }
        completeLogin(res.data.token, res.data.role, res.data.primeraVezLogin)
        return
      }
      const msg = res.message ?? "Credenciales incorrectas"
      setError(msg)
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } catch (err: unknown) {
      const errObj = err as Error & {
        data?: { message?: string }
        status?: number
      }

      if (errObj.status === 409) {
        const msg = errObj.data?.message ?? ADMIN_PANEL_OCCUPIED_MSG
        setLogin409(true)
        setAdminPanelOcupado(true)
        setError(msg)
        return
      }

      if (errObj.status === 401) {
        const msg = errObj.data?.message ?? "Credenciales incorrectas"
        setError(msg)
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        })
        return
      }

      const apiMessage = errObj?.data?.message
      const networkMessage = errObj?.message
      const isCorsOrNetwork =
        networkMessage?.includes("Failed to fetch") ||
        networkMessage?.includes("NetworkError") ||
        networkMessage?.includes("CORS")
      const message =
        apiMessage ??
        (isCorsOrNetwork
          ? "Error al conectar. Verifique que el backend esté en marcha."
          : "Error al conectar con el servidor.")
      setError(message)
      toast({
        title: "Error",
        description: isCorsOrNetwork
          ? "Error al conectar. Verifique que el backend esté en marcha."
          : message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await attemptLogin(false)
  }

  const handleRetry = async () => {
    setLogin409(false)
    setError(null)
    await refreshAdminSessionStatus()
  }

  const handleForceLogin = async () => {
    await attemptLogin(true)
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      <div className="bg-institutional-navy px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
          <Gavel className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Acceso Matriculados
        </h1>
        <p className="mt-2 text-white/70">Ingrese a su área privada</p>
      </div>

      <div className="p-6 sm:p-8">
        {sessionMessage && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-100 text-sm border border-amber-500/20">
            {sessionMessage}
          </div>
        )}

        {adminPanelOcupado && !login409 && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-100 text-sm border border-amber-500/20 flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{ADMIN_PANEL_OCCUPIED_MSG}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {login409 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Si la comisión acordó reemplazar la sesión activa, puede forzar el
              acceso. De lo contrario, coordinen por WhatsApp e intenten más tarde.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={loading}
                onClick={() => void handleRetry()}
              >
                Reintentar
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={loading}
                onClick={() => void handleForceLogin()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Forzar acceso"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="matricula">Número de Matrícula</Label>
              <Input
                id="matricula"
                type="text"
                placeholder="Ej: M-0001"
                required
                value={formData.matricula}
                onChange={(e) =>
                  setFormData({ ...formData, matricula: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  required
                  className="pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Recordarme
                </Label>
              </div>
              <Link
                href="/olvide-contrasena"
                className="text-sm text-primary hover:underline"
              >
                Olvidé mi contraseña
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ¿Problemas para ingresar?{" "}
            <Link href="/contacto" className="text-primary hover:underline">
              Contáctenos
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
