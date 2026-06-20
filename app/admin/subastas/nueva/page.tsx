"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText, ImagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  crearPublicacionExterna,
  type CrearSubastaExternaRequest,
} from "@/lib/api"

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"
const EMPTY_FORM: CrearSubastaExternaRequest = {
  titulo: "",
  descripcion: "",
  precioInicial: 0,
  martilleroACargo: "",
  nombreMartillero: "",
  cuitMartillero: "",
  domicilio: "",
  fechaInicio: "",
  fechaFin: "",
  edictoTexto: "",
  numeroEdicto: "",
  fechaPublicacionBoletin: "",
}

export default function NuevaPublicacionExternaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CrearSubastaExternaRequest>(EMPTY_FORM)
  const [imagenes, setImagenes] = useState<File[]>([])

  const setFechaInicio = (fechaInicio: string) => {
    setForm((f) => ({
      ...f,
      fechaInicio,
      fechaPublicacionBoletin: fechaInicio,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      const created = await crearPublicacionExterna(form, {
        imagenes: imagenes.length > 0 ? imagenes : undefined,
      })
      if (created) {
        router.push("/admin/subastas")
        return
      }
      setError("No se pudo crear la publicación.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear la publicación.")
    } finally {
      setLoading(false)
    }
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
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Nueva publicación externa
      </h1>
      <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
        Edicto de un tercero que contactó al colegio y no es matriculado. Los
        datos del publicante son obligatorios (referencia, nombre y CUIT).
      </p>

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
                placeholder="Ej. REF-2026-001"
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
                <Label htmlFor="cuitMartillero">CUIT del publicante (11 dígitos)</Label>
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
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Edicto
            </CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              El PDF lo publica el Boletín Oficial de Mendoza; aquí solo se carga
              el texto y la referencia del edicto.
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
                <Label htmlFor="numeroEdicto">Número / referencia del edicto</Label>
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
                  title="Se sincroniza automáticamente con la fecha de inicio"
                />
                <p className="text-xs text-muted-foreground">
                  Debe coincidir con la fecha de inicio (se actualiza sola).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-primary" />
              Imágenes (opcional)
            </Label>
            <Input
              type="file"
              accept={ACCEPT_IMAGES}
              multiple
              className="cursor-pointer"
              onChange={(e) => {
                setImagenes(e.target.files ? Array.from(e.target.files) : [])
              }}
            />
            {imagenes.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {imagenes.length} archivo(s) seleccionado(s).
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Publicar edicto
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
