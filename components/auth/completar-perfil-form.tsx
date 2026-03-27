"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gavel, UserPlus, Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { completarPerfil, getCurrentUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function CompletarPerfilForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    cuit: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.trim() || !formData.password) {
      toast({
        title: "Error",
        description: "Complete los campos requeridos.",
        variant: "destructive",
      })
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const res = await completarPerfil({
        email: formData.email.trim(),
        password: formData.password,
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
    } catch {
      toast({
        title: "Error",
        description: "Error al guardar. Intente de nuevo.",
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
          Es su primer acceso. Complete su email y contraseña para continuar.
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
            <Label htmlFor="password">Contraseña nueva *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña nueva"
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
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirmar contraseña *</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="Repetir contraseña"
              required
              value={formData.passwordConfirm}
              onChange={(e) =>
                setFormData({ ...formData, passwordConfirm: e.target.value })
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
