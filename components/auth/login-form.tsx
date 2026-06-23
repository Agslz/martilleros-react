"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gavel, Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  getCurrentUser,
  getToken,
  login,
  saveToken,
} from "@/lib/api"
import { getApiConnectionErrorMessage, isApiMisconfiguredInBrowser } from "@/lib/api/config"
import {
  consumeAdminLogoutMessage,
  saveAdminLoginSession,
  saveMatriculadoLoginSession,
} from "@/lib/admin-session"
import {
  getPrivateAreaPath,
  loadRememberedLogin,
  persistRememberedLogin,
} from "@/lib/remember-login"
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
  const [login409, setLogin409] = useState(false)
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    remember: false,
  })

  useEffect(() => {
    setSessionMessage(consumeAdminLogoutMessage())

    const remembered = loadRememberedLogin()
    setFormData((prev) => ({
      ...prev,
      remember: remembered.remember,
      matricula: remembered.matricula || prev.matricula,
    }))

    const token = typeof window !== "undefined" ? getToken() : null
    if (!token) return

    getCurrentUser()
      .then((user) => {
        if (!user) return
        router.replace(
          getPrivateAreaPath(user.role, user.primeraVezLogin)
        )
      })
      .catch(() => {
        /* token inválido: mostrar formulario */
      })
  }, [router])

  const completeLogin = (
    token: string,
    role: string,
    primeraVezLogin: boolean,
    remember: boolean,
    matricula: string
  ) => {
    persistRememberedLogin(remember, matricula)
    saveToken(token, remember)
    if (role === "ADMIN") {
      router.push("/admin")
    } else if (primeraVezLogin) {
      router.push("/completar-perfil")
    } else {
      router.push("/panel")
    }
  }

  const attemptLogin = async () => {
    setError(null)
    setLogin409(false)
    setLoading(true)
    try {
      const res = await login(formData.matricula, formData.password)
      if (res.success && res.data) {
        if (res.data.role === "ADMIN") {
          saveAdminLoginSession(res.data)
        } else {
          saveMatriculadoLoginSession()
        }
        completeLogin(
          res.data.token,
          res.data.role,
          res.data.primeraVezLogin,
          formData.remember,
          formData.matricula
        )
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
        networkMessage?.includes("CORS") ||
        networkMessage?.includes("fetch failed")
      const message =
        apiMessage ??
        (isCorsOrNetwork || isApiMisconfiguredInBrowser()
          ? getApiConnectionErrorMessage()
          : "Error al conectar con el servidor.")
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await attemptLogin()
  }

  const handleVolver = () => {
    setLogin409(false)
    setError(null)
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

        {login409 ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error ?? ADMIN_PANEL_OCCUPIED_MSG}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleVolver}
            >
              Volver
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

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
          </>
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
