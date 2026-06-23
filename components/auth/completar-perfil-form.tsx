"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Gavel, UserPlus, Loader2, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  AUTH_PASSWORD_MIN_LENGTH,
  completarPerfil,
  getCurrentUser,
} from "@/lib/api"
import {
  displayCuit,
  formatCuitInput,
  isValidCuit,
  stripCuit,
} from "@/lib/cuit"
import { TelefonoInput } from "@/components/ui/telefono-input"
import {
  displayTelefono,
  isValidTelefono,
  mergeTelefono,
  splitTelefono,
} from "@/lib/telefono"
import { useToast } from "@/hooks/use-toast"

export function CompletarPerfilForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [cuitFromAdmin, setCuitFromAdmin] = useState(false)
  const [telefonoFromAdmin, setTelefonoFromAdmin] = useState(false)
  const [telArea, setTelArea] = useState("")
  const [telNumero, setTelNumero] = useState("")
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    contrasenaActual: "",
    nuevaContrasena: "",
    nuevaContrasenaConfirm: "",
    cuit: "",
  })

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (!user) return
        const adminCuit = stripCuit(user.cuit ?? "")
        const adminTel = user.telefono?.trim() ?? ""
        setCuitFromAdmin(adminCuit.length === 11)
        setTelefonoFromAdmin(adminTel.length >= 10)
        const { codigoArea, numero } = splitTelefono(adminTel)
        setTelArea(codigoArea)
        setTelNumero(numero)
        setFormData((prev) => ({
          ...prev,
          email: user.email?.trim() ?? prev.email,
          cuit: adminCuit,
        }))
      })
      .finally(() => setLoadingUser(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Correo electrónico».",
        variant: "destructive",
      })
      return
    }
    if (!formData.contrasenaActual) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Contraseña actual».",
        variant: "destructive",
      })
      return
    }
    if (!formData.nuevaContrasena) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Contraseña nueva».",
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
    if (!cuitFromAdmin && !isValidCuit(formData.cuit)) {
      toast({
        title: "CUIT requerido",
        description:
          "Debés cargar tu CUIT con 11 dígitos (formato xx-xxxxxxxx-x).",
        variant: "destructive",
      })
      return
    }

    const telefonoMerged = mergeTelefono(telArea, telNumero)
    if (!telefonoFromAdmin && telefonoMerged && !isValidTelefono(telefonoMerged)) {
      toast({
        title: "Teléfono inválido",
        description: "El teléfono debe tener entre 10 y 11 dígitos (sin el 15).",
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
        cuit: cuitFromAdmin ? undefined : stripCuit(formData.cuit),
        telefono: telefonoFromAdmin
          ? undefined
          : telefonoMerged || undefined,
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

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
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
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="su@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contrasenaActual">Contraseña actual</Label>
            <p className="text-xs text-muted-foreground">
              La contraseña temporal con la que acaba de iniciar sesión.
            </p>
            <div className="relative">
              <Input
                id="contrasenaActual"
                type={showActual ? "text" : "password"}
                placeholder="Contraseña con la que ingresó"
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
            <Label htmlFor="nuevaContrasena">Contraseña nueva</Label>
            <p className="text-xs text-muted-foreground">
              Mínimo {AUTH_PASSWORD_MIN_LENGTH} caracteres.
            </p>
            <div className="relative">
              <Input
                id="nuevaContrasena"
                type={showNueva ? "text" : "password"}
                placeholder="Contraseña nueva"
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
            <Label htmlFor="nuevaContrasenaConfirm">Confirmar contraseña nueva</Label>
            <Input
              id="nuevaContrasenaConfirm"
              type="password"
              placeholder="Repetir contraseña nueva"
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
            <Label htmlFor="cuit">
              CUIT {cuitFromAdmin ? "" : "(obligatorio)"}
            </Label>
            {cuitFromAdmin ? (
              <>
                <Input
                  id="cuit"
                  value={displayCuit(formData.cuit)}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  El CUIT fue cargado por el Colegio al dar de alta su matrícula.
                </p>
              </>
            ) : (
              <>
                <Input
                  id="cuit"
                  inputMode="numeric"
                  placeholder="20-12345678-9"
                  value={formatCuitInput(formData.cuit)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cuit: stripCuit(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Si el administrador no cargó su CUIT, debe ingresarlo aquí.
                </p>
              </>
            )}
          </div>
          {telefonoFromAdmin ? (
            <div className="space-y-2">
              <Label htmlFor="telefono-display">Teléfono celular</Label>
              <Input
                id="telefono-display"
                value={displayTelefono(mergeTelefono(telArea, telNumero))}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El teléfono fue cargado por el Colegio al dar de alta su matrícula.
              </p>
            </div>
          ) : (
            <TelefonoInput
              idPrefix="completar-perfil"
              codigoArea={telArea}
              numero={telNumero}
              onChange={(codigoArea, numero) => {
                setTelArea(codigoArea)
                setTelNumero(numero)
              }}
            />
          )}
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
