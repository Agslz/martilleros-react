"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { crearMatriculado, type CrearMatriculadoRequest } from "@/lib/api"

export default function NuevoMatriculadoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdPassword, setCreatedPassword] = useState<string | null>(null)
  const [form, setForm] = useState<CrearMatriculadoRequest>({
    nombre: "",
    apellido: "",
    dni: "",
    matricula: "",
    email: "",
    cuit: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCreatedPassword(null)
    setLoading(true)
    try {
      const body = {
        ...form,
        email: form.email?.trim() || undefined,
        cuit: form.cuit?.trim() || undefined,
      }
      const created = await crearMatriculado(body)
      if (created) {
        if (created.password) {
          setCreatedPassword(created.password)
        } else {
          router.push("/admin/matriculados/nuevo")
        }
        return
      }
      setError("No se pudo crear el matriculado.")
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

  if (createdPassword) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Matriculado creado
        </h1>
        <div className="rounded-lg border border-border bg-muted/30 p-4 max-w-md">
          <p className="text-sm text-muted-foreground mb-2">
            La contraseña temporal generada es (guardala, no se volverá a mostrar):
          </p>
          <p className="font-mono font-semibold text-foreground break-all">
            {createdPassword}
          </p>
        </div>
        <Button className="mt-6" asChild>
          <Link href="/admin/matriculados/nuevo">Crear otro matriculado</Link>
        </Button>
      </div>
    )
  }

  return (
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
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              required
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
              required
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              required
              value={form.matricula}
              onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuit">CUIT (opcional)</Label>
          <Input
            id="cuit"
            value={form.cuit ?? ""}
            onChange={(e) =>
              setForm({ ...form, cuit: e.target.value.replace(/\D/g, "") })
            }
          />
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
  )
}
