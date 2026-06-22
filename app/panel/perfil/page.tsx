"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { User, Lock, Loader2, Eye, EyeOff, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AUTH_PASSWORD_MIN_LENGTH,
  getCurrentUser,
  cambiarContrasena,
  actualizarPerfil,
} from "@/lib/api"
import type { UserInfoResponse } from "@/lib/api"
import { displayCuit, formatCuitInput, stripCuit } from "@/lib/cuit"
import { resolveStorageFileUrl } from "@/lib/storage-url"
import { useToast } from "@/hooks/use-toast"

export default function PanelPerfilPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordNuevaConfirm: "",
  })
  const [profileForm, setProfileForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cuit: "",
  })

  useEffect(() => {
    getCurrentUser()
      .then((u) => {
        setUser(u)
        if (u) {
          setProfileForm({
            nombre: u.nombre ?? "",
            apellido: u.apellido ?? "",
            email: u.email ?? "",
            cuit: u.cuit ?? "",
          })
        }
      })
      .finally(() => setLoadingUser(false))
  }, [])

  const fotoUrl = user?.fotoCarnetUrl
    ? resolveStorageFileUrl(user.fotoCarnetUrl)
    : null

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.nombre.trim()) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Nombre».",
        variant: "destructive",
      })
      return
    }
    if (!profileForm.apellido.trim()) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Apellido».",
        variant: "destructive",
      })
      return
    }
    setLoadingProfile(true)
    try {
      const res = await actualizarPerfil({
        nombre: profileForm.nombre.trim(),
        apellido: profileForm.apellido.trim(),
        email: profileForm.email.trim() || undefined,
        cuit: stripCuit(profileForm.cuit) || undefined,
      })
      if (res.success && res.data) {
        setUser(res.data)
        toast({
          title: "Listo",
          description: "Datos actualizados correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: res.message ?? "No se pudieron actualizar los datos.",
          variant: "destructive",
        })
      }
    } catch (err: unknown) {
      const errObj = err as { status?: number; message?: string; data?: { message?: string } }
      const isNotImplemented =
        errObj?.status === 404 ||
        errObj?.status === 405 ||
        (typeof errObj?.message === "string" && errObj.message.includes("404"))
      toast({
        title: "Error",
        description: isNotImplemented
          ? "El backend aún no permite modificar estos datos. Contacte al Colegio si necesita actualizar su perfil."
          : errObj?.data?.message ?? errObj?.message ?? "No se pudieron actualizar los datos.",
        variant: "destructive",
      })
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.passwordNueva !== form.passwordNuevaConfirm) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
      })
      return
    }
    if (!form.passwordActual) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Contraseña actual».",
        variant: "destructive",
      })
      return
    }
    if (!form.passwordNueva) {
      toast({
        title: "Campo requerido",
        description: "Completá el campo «Contraseña nueva».",
        variant: "destructive",
      })
      return
    }
    if (form.passwordNueva.length < AUTH_PASSWORD_MIN_LENGTH) {
      toast({
        title: "Error",
        description: `La contraseña nueva debe tener al menos ${AUTH_PASSWORD_MIN_LENGTH} caracteres.`,
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      const res = await cambiarContrasena({
        contrasenaActual: form.passwordActual,
        nuevaContrasena: form.passwordNueva,
      })
      if (res.success) {
        toast({
          title: "Listo",
          description: "Contraseña actualizada correctamente.",
        })
        setForm({
          passwordActual: "",
          passwordNueva: "",
          passwordNuevaConfirm: "",
        })
        return
      }
      const msg = res.message ?? "No se pudo cambiar la contraseña."
      const isWrong =
        msg.toLowerCase().includes("actual") || msg.toLowerCase().includes("correcta")
      toast({
        title: "Error",
        description: isWrong ? "La contraseña actual no es correcta." : msg,
        variant: "destructive",
      })
    } catch {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <User className="h-7 w-7 text-primary" />
        Mi perfil
      </h1>

      {user && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Datos de la cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-muted ring-2 ring-primary/10">
                  {fotoUrl ? (
                    <Image
                      src={fotoUrl}
                      alt={`Foto de ${user.nombre} ${user.apellido}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm flex-1">
                  <p>
                    <span className="text-muted-foreground">Matrícula:</span>{" "}
                    <span className="font-medium">{user.matricula}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Nombre:</span>{" "}
                    <span className="font-medium">
                      {user.nombre} {user.apellido}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">
                      {user.email || "—"}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">CUIT:</span>{" "}
                    <span className="font-medium">
                      {user.cuit ? displayCuit(user.cuit) : "—"}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Editar mis datos
              </CardTitle>
              <p className="text-sm text-muted-foreground font-normal">
                Modificá tu nombre, apellido, email y CUIT. La matrícula no se puede cambiar.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="matricula-display">Matrícula</Label>
                  <Input
                    id="matricula-display"
                    value={user.matricula}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={profileForm.nombre}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={profileForm.apellido}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, apellido: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <Input
                    id="cuit"
                    inputMode="numeric"
                    placeholder="20-12345678-9"
                    value={formatCuitInput(profileForm.cuit)}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        cuit: stripCuit(e.target.value),
                      })
                    }
                  />
                </div>
                <Button type="submit" disabled={loadingProfile}>
                  {loadingProfile ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Pencil className="h-4 w-4 mr-2" />
                  )}
                  Guardar cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Cambiar contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="passwordActual">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="passwordActual"
                  type={showActual ? "text" : "password"}
                  className="pr-10"
                  value={form.passwordActual}
                  onChange={(e) =>
                    setForm({ ...form, passwordActual: e.target.value })
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
              <Label htmlFor="passwordNueva">Contraseña nueva</Label>
              <p className="text-xs text-muted-foreground">
                Mínimo {AUTH_PASSWORD_MIN_LENGTH} caracteres.
              </p>
              <div className="relative">
                <Input
                  id="passwordNueva"
                  type={showNueva ? "text" : "password"}
                  minLength={AUTH_PASSWORD_MIN_LENGTH}
                  className="pr-10"
                  value={form.passwordNueva}
                  onChange={(e) =>
                    setForm({ ...form, passwordNueva: e.target.value })
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
              <Label htmlFor="passwordNuevaConfirm">Confirmar contraseña nueva</Label>
              <Input
                id="passwordNuevaConfirm"
                type="password"
                minLength={AUTH_PASSWORD_MIN_LENGTH}
                value={form.passwordNuevaConfirm}
                onChange={(e) =>
                  setForm({ ...form, passwordNuevaConfirm: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Actualizar contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
