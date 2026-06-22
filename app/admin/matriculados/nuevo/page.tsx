"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CredencialesMatriculadoDialog } from "@/components/admin/credenciales-matriculado-dialog"
import {
  crearMatriculado,
  type CrearMatriculadoRequest,
  type CrearMatriculadoResponse,
} from "@/lib/api"
import {
  formatCuitInput,
  isValidCuit,
  stripCuit,
} from "@/lib/cuit"
import { useToast } from "@/hooks/use-toast"

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

const REQUIRED_FIELDS: { key: keyof CrearMatriculadoRequest; label: string }[] =
  [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "dni", label: "DNI" },
    { key: "matricula", label: "Matrícula" },
    { key: "email", label: "Email" },
    { key: "cuit", label: "CUIT" },
  ]

export default function NuevoMatriculadoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<CrearMatriculadoResponse | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState<CrearMatriculadoRequest>({
    nombre: "",
    apellido: "",
    dni: "",
    matricula: "",
    email: "",
    cuit: "",
  })

  useEffect(() => {
    if (!foto) {
      setFotoPreview(null)
      return
    }
    const url = URL.createObjectURL(foto)
    setFotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [foto])

  const validateForm = (): boolean => {
    for (const { key, label } of REQUIRED_FIELDS) {
      const value = String(form[key] ?? "").trim()
      if (!value) {
        toast({
          title: "Campo requerido",
          description: `Completá el campo «${label}».`,
          variant: "destructive",
        })
        return false
      }
    }

    if (!isValidCuit(form.cuit)) {
      toast({
        title: "CUIT inválido",
        description: "El CUIT debe tener 11 dígitos (formato xx-xxxxxxxx-x).",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCreated(null)

    if (!validateForm()) return

    setLoading(true)
    try {
      const body = {
        ...form,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        matricula: form.matricula.trim(),
        email: form.email.trim(),
        cuit: stripCuit(form.cuit),
      }
      const result = await crearMatriculado(body, foto)
      if (result?.contrasenaTemporal) {
        setCreated(result)
        return
      }
      setError(
        result
          ? "El matriculado se creó pero no se recibió la contraseña temporal. Verificá el email o contactá al administrador del sistema."
          : "No se pudo crear el matriculado."
      )
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear el matriculado.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmCredenciales = () => {
    setCreated(null)
    router.push("/admin/matriculados")
  }

  const cuitDisplay = useMemo(() => formatCuitInput(form.cuit), [form.cuit])

  return (
    <>
      {created && (
        <CredencialesMatriculadoDialog
          open
          data={created}
          onConfirm={handleConfirmCredenciales}
        />
      )}

      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Nuevo matriculado
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={form.dni}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                value={form.matricula}
                onChange={(e) => setForm({ ...form, matricula: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuit">CUIT</Label>
            <Input
              id="cuit"
              inputMode="numeric"
              placeholder="20-12345678-9"
              value={cuitDisplay}
              onChange={(e) =>
                setForm({ ...form, cuit: stripCuit(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="foto">Foto carnet</Label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border bg-muted ring-2 ring-primary/10">
                {fotoPreview ? (
                  <Image
                    src={fotoPreview}
                    alt="Vista previa de la foto carnet"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  id="foto"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    if (!file) {
                      setFoto(null)
                      return
                    }
                    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                      toast({
                        title: "Formato no permitido",
                        description:
                          "Usá JPEG, JPG, PNG, WEBP o GIF para la foto carnet.",
                        variant: "destructive",
                      })
                      e.target.value = ""
                      setFoto(null)
                      return
                    }
                    setError(null)
                    setFoto(file)
                  }}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Tipos permitidos: JPG, JPEG, PNG, WEBP, GIF.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Crear matriculado
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin">Cancelar</Link>
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
