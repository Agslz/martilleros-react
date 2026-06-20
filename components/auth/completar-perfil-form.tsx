"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gavel, UserPlus, Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AUTH_PASSWORD_MIN_LENGTH, completarPerfil, getCurrentUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function CompletarPerfilForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    contrasenaActual: "",
    nuevaContrasena: "",
    nuevaContrasenaConfirm: "",
    cuit: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.email.trim() ||
      !formData.contrasenaActual ||
      !formData.nuevaContrasena
    ) {
      toast({
        title: "Error",
        description: "Complete los campos requeridos.",
        variant: "destructive",
      })
      return
    }
    if (formData.nuevaContrasena.length < AUTH_PASSWORD_MIN_LENGTH) {
      toast({
        title: "Error",
        description: `La contraseña nueva debe tener al menos ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
        variant: "destructive",
      })
      return
    }
    if (formData.nuevaContrasena !== formData.nuevaContrasenaConfirm) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const res = await completarPerfil({
        email: formData.email.trim(),
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.nuevaContrasena,
        cuit: formData.cuit.trim() || undefined,
      })
      if (res.success) {
        toast({
          title: "Listo",
          description: "Perfil completado. Ya puede usar su nueva contraseña.",
        })
        const user = await getCurrentUser()
        router.push(user?.role === "ADMIN" ? "/admin" : "/panel")
        return
      }
      toast({
        title: "Error",
        description: res.message ?? "Error al guardar. Intente de nuevo.",
        variant: "destructive",
      })
    } catch (err: unknown) {
      const errObj = err as { message?: string; data?: { message?: string } }
      const msg =
        errObj?.data?.message ??
        errObj?.message ??
        "Error al guardar. Intente de nuevo."
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      <div className="bg-institutional-navy px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
          <Gavel className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Completar perfil
        </h1>
        <p className="mt-2 text-white/70">
          Es su primer acceso. Indique su email, la contraseña con la que ingresó
          y elija una contraseña nueva para continuar.
        </p>
      </div>
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="su@email.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contrasenaActual">Contraseña actual *</Label>
            <p className="text-xs text-muted-foreground">
              La contraseña temporal con la que acaba de iniciar sesión.
            </p>
            <div className="relative">
              <Input
                id="contrasenaActual"
                type={showActual ? "text" : "password"}
                placeholder="Contraseña con la que ingresó"
                required
                className="pr-10"
                value={formData.contrasenaActual}
                onChange={(e) =>
                  setFormData({ ...formData, contrasenaActual: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowActual(!showActual)}
              >
                {showActual ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nuevaContrasena">Contraseña nueva *</Label>
            <p className="text-xs text-muted-foreground">
              Mínimo {AUTH_PASSWORD_MIN_LENGTH} caracteres.
            </p>
            <div className="relative">
              <Input
                id="nuevaContrasena"
                type={showNueva ? "text" : "password"}
                placeholder="Contraseña nueva"
                required
                minLength={AUTH_PASSWORD_MIN_LENGTH}
                className="pr-10"
                value={formData.nuevaContrasena}
                onChange={(e) =>
                  setFormData({ ...formData, nuevaContrasena: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNueva(!showNueva)}
              >
                {showNueva ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nuevaContrasenaConfirm">Confirmar contraseña nueva *</Label>
            <Input
              id="nuevaContrasenaConfirm"
              type="password"
              placeholder="Repetir contraseña nueva"
              required
              minLength={AUTH_PASSWORD_MIN_LENGTH}
              value={formData.nuevaContrasenaConfirm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nuevaContrasenaConfirm: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuit">CUIT (opcional)</Label>
            <Input
              id="cuit"
              type="text"
              placeholder="20-12345678-9"
              value={formData.cuit}
              onChange={(e) =>
                setFormData({ ...formData, cuit: e.target.value })
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            {loading ? "Guardando..." : "Completar perfil"}
          </Button>
        </form>
      </div>
    </div>
  )
}
