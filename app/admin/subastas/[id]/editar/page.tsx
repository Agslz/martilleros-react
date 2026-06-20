"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getSubastasPrivadas,
  actualizarPublicacionExterna,
  type ActualizarSubastaExternaRequest,
  type SubastaResponse,
} from "@/lib/api"

function subastaToForm(s: SubastaResponse): ActualizarSubastaExternaRequest {
  return {
    titulo: s.titulo,
    descripcion: s.descripcion,
    precioInicial: s.precioInicial,
    martilleroACargo: s.martilleroACargo,
    nombreMartillero: s.nombreMartillero,
    cuitMartillero: s.cuitMartillero,
    domicilio: s.domicilio,
    fechaInicio: s.fechaInicio,
    fechaFin: s.fechaFin,
    edictoTexto: s.edictoTexto ?? "",
    numeroEdicto: s.numeroEdicto ?? "",
    fechaPublicacionBoletin:
      s.fechaPublicacionBoletin ?? s.fechaInicio,
  }
}

export default function EditarSubastaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subasta, setSubasta] = useState<SubastaResponse | null>(null)
  const [form, setForm] = useState<ActualizarSubastaExternaRequest | null>(null)

  useEffect(() => {
    getSubastasPrivadas().then((list) => {
      const s = list.find((x) => x.id === id) ?? null
      setSubasta(s)
      if (s) setForm(subastaToForm(s))
      setLoadingData(false)
    })
  }, [id])

  const setFechaInicio = (fechaInicio: string) => {
    setForm((f) =>
      f
        ? {
            ...f,
            fechaInicio,
            fechaPublicacionBoletin: fechaInicio,
          }
        : f
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)

    if (form.precioInicial <= 0) {
      setError("El precio inicial debe ser mayor a 0.")
      return
    }
    if (form.fechaFin < form.fechaInicio) {
      setError("La fecha de fin no puede ser anterior a la de inicio.")
      return
    }
    if (form.fechaPublicacionBoletin !== form.fechaInicio) {
      setError(
        "La fecha de publicación en el Boletín debe coincidir con la fecha de inicio."
      )
      return
    }

    setLoading(true)
    try {
      const updated = await actualizarPublicacionExterna(id, form)
      if (updated) {
        router.push("/admin/subastas")
        return
      }
      setError("No se pudo actualizar la publicación.")
    } catch (err: unknown) {
      const errObj = err as { status?: number; data?: { message?: string } }
      const msg = errObj?.data?.message
      if (errObj?.status === 400 && !subasta?.esPublicacionExterna) {
        setError(
          "Solo se pueden editar publicaciones externas creadas por el admin."
        )
      } else {
        setError(msg ?? "Error al actualizar la publicación.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!subasta || !form) {
    return (
      <div>
        <p className="text-muted-foreground">Subasta no encontrada.</p>
        <Button variant="link" asChild>
          <Link href="/admin/subastas">Volver a subastas</Link>
        </Button>
      </div>
    )
  }

  if (!subasta.esPublicacionExterna) {
    return (
      <div>
        <Link
          href="/admin/subastas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a subastas
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          No editable
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Esta subasta fue creada por un matriculado. El admin solo puede
          modificar publicaciones externas (terceros no matriculados) mediante{" "}
          <code className="text-sm">PUT /api/admin/subastas/&#123;id&#125;</code>
          .
        </p>
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/admin/subastas">Volver al listado</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/admin/subastas"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a subastas
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Editar publicación externa
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            required
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precioInicial">Precio inicial</Label>
            <Input
              id="precioInicial"
              type="number"
              min={1}
              required
              value={form.precioInicial || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  precioInicial: Number(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domicilio">Domicilio</Label>
            <Input
              id="domicilio"
              required
              value={form.domicilio}
              onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
            />
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">Datos del publicante externo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="martilleroACargo">Referencia del publicante</Label>
              <Input
                id="martilleroACargo"
                required
                value={form.martilleroACargo}
                onChange={(e) =>
                  setForm({ ...form, martilleroACargo: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreMartillero">Nombre del publicante</Label>
                <Input
                  id="nombreMartillero"
                  required
                  value={form.nombreMartillero}
                  onChange={(e) =>
                    setForm({ ...form, nombreMartillero: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuitMartillero">CUIT del publicante</Label>
                <Input
                  id="cuitMartillero"
                  required
                  maxLength={11}
                  value={form.cuitMartillero}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cuitMartillero: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha inicio</Label>
            <Input
              id="fechaInicio"
              type="date"
              required
              value={form.fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha fin</Label>
            <Input
              id="fechaFin"
              type="date"
              required
              min={form.fechaInicio || undefined}
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            />
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base">Edicto</CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              El PDF lo publica el Boletín Oficial; solo se edita texto y
              referencia del edicto.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edictoTexto">Texto completo del edicto</Label>
              <Textarea
                id="edictoTexto"
                required
                rows={6}
                value={form.edictoTexto}
                onChange={(e) =>
                  setForm({ ...form, edictoTexto: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroEdicto">Número / referencia</Label>
                <Input
                  id="numeroEdicto"
                  required
                  value={form.numeroEdicto}
                  onChange={(e) =>
                    setForm({ ...form, numeroEdicto: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaPublicacionBoletin">
                  Fecha publicación en Boletín
                </Label>
                <Input
                  id="fechaPublicacionBoletin"
                  type="date"
                  required
                  readOnly
                  className="bg-muted/50"
                  value={form.fechaPublicacionBoletin}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
