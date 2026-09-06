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
  getSubastaPrivadaById,
  actualizarPublicacionExterna,
  type BienSubastaRequest,
  type SubastaResponse,
} from "@/lib/api"
import { esModificablePorAdmin } from "@/lib/subasta-display"
import {
  BienesFormFields,
  validateBienes,
} from "@/components/subastas/bienes-form-fields"
import { BasesDisplay } from "@/components/subastas/bases-display"

function bienesFromSubasta(s: SubastaResponse): BienSubastaRequest[] {
  if (s.bienes && s.bienes.length > 0) {
    return s.bienes.map((b) => ({
      titulo: b.titulo,
      precioBase: b.precioBase,
    }))
  }
  return [{ titulo: "Bien", precioBase: s.precioInicial }]
}

export default function EditarSubastaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subasta, setSubasta] = useState<SubastaResponse | null>(null)
  const [cantidadBienes, setCantidadBienes] = useState(1)
  const [bienes, setBienes] = useState<BienSubastaRequest[]>([
    { titulo: "Bien", precioBase: 0 },
  ])
  const [form, setForm] = useState<{
    titulo: string
    descripcion: string
    martilleroACargo: string
    nombreMartillero: string
    cuitMartillero: string
    domicilio: string
    fechaInicio: string
    fechaFin: string
    edictoTexto: string
    numeroEdicto: string
    fechaPublicacionBoletin: string
  } | null>(null)

  useEffect(() => {
    getSubastaPrivadaById(id).then((s) => {
      setSubasta(s)
      if (s) {
        const b = bienesFromSubasta(s)
        setBienes(b)
        setCantidadBienes(b.length)
        setForm({
          titulo: s.titulo,
          descripcion: s.descripcion,
          martilleroACargo: s.martilleroACargo,
          nombreMartillero: s.nombreMartillero,
          cuitMartillero: s.cuitMartillero,
          domicilio: s.domicilio,
          fechaInicio: s.fechaInicio ?? "",
          fechaFin: s.fechaFin ?? "",
          edictoTexto: s.edictoTexto ?? "",
          numeroEdicto: s.numeroEdicto ?? "",
          fechaPublicacionBoletin:
            s.fechaPublicacionBoletin ?? s.fechaInicio ?? "",
        })
      }
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

    const errBienes = validateBienes(bienes)
    if (errBienes) {
      setError(errBienes)
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
      const updated = await actualizarPublicacionExterna(id, {
        ...form,
        bienes: bienes.map((b) => ({
          titulo: b.titulo.trim() || "Bien",
          precioBase: b.precioBase,
        })),
        precioInicial: bienes[0]?.precioBase,
      })
      if (updated) {
        router.push("/admin/subastas")
        return
      }
      setError("No se pudo actualizar la publicación.")
    } catch (err: unknown) {
      const errObj = err as { status?: number; data?: { message?: string } }
      const msg = errObj?.data?.message
      if (errObj?.status === 400 && subasta && !esModificablePorAdmin(subasta)) {
        setError(
          "Los edictos publicados por matriculados solo pueden consultarse. No pueden modificarse ni eliminarse desde el panel admin."
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
        <p className="text-muted-foreground">Edicto no encontrado.</p>
        <Button variant="link" asChild>
          <Link href="/admin/subastas">Volver a edictos</Link>
        </Button>
      </div>
    )
  }

  if (!esModificablePorAdmin(subasta)) {
    return (
      <div>
        <Link
          href="/admin/subastas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a edictos
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {subasta.titulo}
        </h1>
        <p className="text-muted-foreground max-w-lg mb-6">
          Edicto de matriculado (solo lectura). Podés ver los datos e imágenes
          cargadas; no se puede editar ni eliminar desde el panel admin.
        </p>

        <Card className="max-w-3xl mb-6">
          <CardHeader>
            <CardTitle className="text-base">Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              <span className="text-muted-foreground">Martillero: </span>
              {subasta.nombreMartillero} ({subasta.martilleroACargo})
            </p>
            <BasesDisplay
              bienes={subasta.bienes}
              precioInicial={subasta.precioInicial}
              priceClassName="text-xl font-bold text-primary leading-tight"
            />
            {subasta.incrementos != null && subasta.incrementos > 0 && (
              <p>
                <span className="text-muted-foreground">Incrementos: </span>
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                }).format(subasta.incrementos)}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Domicilio: </span>
              {subasta.domicilio}
            </p>
            <p>
              <span className="text-muted-foreground">Descripción: </span>
              {subasta.descripcion}
            </p>
          </CardContent>
        </Card>

        {subasta.imagenes && subasta.imagenes.length > 0 ? (
          <div className="max-w-3xl mb-6">
            <h2 className="font-semibold mb-3">Imágenes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {subasta.imagenes
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((img) => (
                  <a
                    key={img.id}
                    href={img.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.fileUrl}
                      alt={img.fileName}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">
            Este edicto no tiene imágenes cargadas.
          </p>
        )}

        <Button className="mt-2" variant="outline" asChild>
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
        Volver a edictos
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

        <BienesFormFields
          cantidad={cantidadBienes}
          onCantidadChange={setCantidadBienes}
          bienes={bienes}
          onBienesChange={setBienes}
        />

        <div className="space-y-2">
          <Label htmlFor="domicilio">Domicilio</Label>
          <Input
            id="domicilio"
            required
            value={form.domicilio}
            onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
          />
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
