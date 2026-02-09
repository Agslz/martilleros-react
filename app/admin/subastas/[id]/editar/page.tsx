"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getSubastasPrivadas,
  actualizarSubasta,
  type SubastaRequest,
} from "@/lib/api"
import type { SubastaResponse } from "@/lib/api"

export default function EditarSubastaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<SubastaRequest | null>(null)

  useEffect(() => {
    getSubastasPrivadas().then((list) => {
      const s = list.find((x) => x.id === id)
      if (s) {
        setForm({
          titulo: s.titulo,
          descripcion: s.descripcion,
          precioInicial: s.precioInicial,
          martilleroACargo: s.martilleroACargo,
          nombreMartillero: s.nombreMartillero,
          cuitMartillero: s.cuitMartillero,
          domicilio: s.domicilio,
          fechaInicio: s.fechaInicio,
          fechaFin: s.fechaFin,
        })
      }
      setLoadingData(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError(null)
    setLoading(true)
    try {
      const updated = await actualizarSubasta(id, form)
      if (updated) {
        router.push("/admin/subastas")
        return
      }
      setError("No se pudo actualizar la subasta.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al actualizar la subasta.")
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

  if (!form) {
    return (
      <div>
        <p className="text-muted-foreground">Subasta no encontrada.</p>
        <Button variant="link" asChild>
          <Link href="/admin/subastas">Volver a subastas</Link>
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Editar subasta</h1>

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
                setForm({ ...form, precioInicial: Number(e.target.value) || 0 })
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="martilleroACargo">Matrícula martillero</Label>
            <Input
              id="martilleroACargo"
              required
              value={form.martilleroACargo}
              onChange={(e) =>
                setForm({ ...form, martilleroACargo: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombreMartillero">Nombre martillero</Label>
            <Input
              id="nombreMartillero"
              required
              value={form.nombreMartillero}
              onChange={(e) =>
                setForm({ ...form, nombreMartillero: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuitMartillero">CUIT martillero (11 dígitos)</Label>
          <Input
            id="cuitMartillero"
            required
            maxLength={11}
            value={form.cuitMartillero}
            onChange={(e) =>
              setForm({ ...form, cuitMartillero: e.target.value.replace(/\D/g, "") })
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha inicio (YYYY-MM-DD)</Label>
            <Input
              id="fechaInicio"
              type="date"
              required
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha fin (YYYY-MM-DD)</Label>
            <Input
              id="fechaFin"
              type="date"
              required
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            />
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
            <Link href="/admin/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
