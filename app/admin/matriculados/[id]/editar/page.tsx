"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TelefonoInput } from "@/components/ui/telefono-input"
import {
  getMatriculadoAdmin,
  actualizarMatriculado,
  type ActualizarMatriculadoRequest,
} from "@/lib/api"
import {
  formatCuitInput,
  isValidCuit,
  stripCuit,
} from "@/lib/cuit"
import { isValidTelefono, mergeTelefono, splitTelefono } from "@/lib/telefono"
import { useToast } from "@/hooks/use-toast"

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

const REQUIRED_FIELDS: { key: keyof ActualizarMatriculadoRequest; label: string }[] =
  [
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "dni", label: "DNI" },
    { key: "matricula", label: "Matrícula" },
    { key: "email", label: "Email" },
    { key: "cuit", label: "CUIT" },
  ]

export default function EditarMatriculadoPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const { toast } = useToast()
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoActualUrl, setFotoActualUrl] = useState<string | null>(null)
  const [form, setForm] = useState<ActualizarMatriculadoRequest | null>(null)
  const [telArea, setTelArea] = useState("")
  const [telNumero, setTelNumero] = useState("")

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoadingData(false)
      return
    }
    getMatriculadoAdmin(id)
      .then((data) => {
        if (!data) {
          setError("Matriculado no encontrado.")
          return
        }
        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          matricula: data.matricula,
          email: data.email ?? "",
          cuit: data.cuit ?? "",
          telefono: data.telefono ?? undefined,
        })
        setFotoActualUrl(data.fotoCarnetUrl)
        const parts = splitTelefono(data.telefono ?? "")
        setTelArea(parts.codigoArea)
        setTelNumero(parts.numero)
      })
      .catch((err: Error) => {
        setError(err.message ?? "No se pudo cargar el matriculado.")
      })
      .finally(() => setLoadingData(false))
  }, [id])

  useEffect(() => {
    if (!foto) {
      setFotoPreview(null)
      return
    }
    const url = URL.createObjectURL(foto)
    setFotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [foto])

  const validateForm = (f: ActualizarMatriculadoRequest): boolean => {
    for (const { key, label } of REQUIRED_FIELDS) {
      const value = String(f[key] ?? "").trim()
      if (!value) {
        toast({
          title: "Campo requerido",
          description: `Completá el campo «${label}».`,
          variant: "destructive",
        })
        return false
      }
    }
    if (!isValidCuit(f.cuit)) {
      toast({
        title: "CUIT inválido",
        description: "El CUIT debe tener 11 dígitos (formato xx-xxxxxxxx-x).",
        variant: "destructive",
      })
      return false
    }
    const telefonoMerged = mergeTelefono(telArea, telNumero)
    if (telefonoMerged && !isValidTelefono(telefonoMerged)) {
      toast({
        title: "Teléfono inválido",
        description: "El teléfono debe tener entre 10 y 11 dígitos (sin el 15).",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    if (!validateForm(form)) return

    setLoading(true)
    try {
      const telefonoMerged = mergeTelefono(telArea, telNumero)
      const body = {
        ...form,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        matricula: form.matricula.trim(),
        email: form.email.trim(),
        cuit: stripCuit(form.cuit),
        telefono: telefonoMerged || undefined,
      }
      const result = await actualizarMatriculado(id, body, foto)
      if (result) {
        toast({
          title: "Matriculado actualizado",
          description: `${result.apellido}, ${result.nombre} (${result.matricula}).`,
        })
        router.push("/admin/matriculados")
        return
      }
      setError("No se pudo actualizar el matriculado.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al actualizar el matriculado.")
    } finally {
      setLoading(false)
    }
  }

  const cuitDisplay = useMemo(
    () => (form ? formatCuitInput(form.cuit) : ""),
    [form]
  )

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!form) {
    return (
      <div>
        <p className="text-muted-foreground">{error ?? "Matriculado no encontrado."}</p>
        <Button variant="link" asChild>
          <Link href="/admin/matriculados">Volver</Link>
        </Button>
      </div>
    )
  }

  const previewSrc = fotoPreview ?? fotoActualUrl

  return (
    <div>
      <Link
        href="/admin/matriculados"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a matriculados
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Editar matriculado
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
        <TelefonoInput
          idPrefix="edit-mat"
          codigoArea={telArea}
          numero={telNumero}
          onChange={(codigoArea, numero) => {
            setTelArea(codigoArea)
            setTelNumero(numero)
          }}
        />
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
              {previewSrc ? (
                <Image
                  src={previewSrc}
                  alt="Foto carnet"
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
                Opcional. Si elegís una nueva imagen, reemplaza la foto actual.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/matriculados">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
