"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gavel, Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { login, saveToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(formData.matricula, formData.password)
      if (res.success && res.data) {
        saveToken(res.data.token)
        if (res.data.primeraVezLogin) {
          router.push("/completar-perfil")
        } else if (res.data.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/panel")
        }
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
      const errObj = err as Error & { data?: { message?: string }; status?: number }
      const apiMessage = errObj?.data?.message
      const networkMessage = errObj?.message
      const isCorsOrNetwork =
        networkMessage?.includes("Failed to fetch") ||
        networkMessage?.includes("NetworkError") ||
        networkMessage?.includes("CORS")
      const message = apiMessage ?? (isCorsOrNetwork ? "Error al conectar. Verifique que el backend esté en marcha." : "Error al conectar con el servidor.")
      setError(message)
      toast({
        title: "Error",
        description: isCorsOrNetwork ? "Error al conectar. Verifique que el backend esté en marcha." : message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-institutional-navy px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
          <Gavel className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Acceso Matriculados
        </h1>
        <p className="mt-2 text-white/70">
          Ingrese a su área privada
        </p>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8">
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
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
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

        {/* Help text */}
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
