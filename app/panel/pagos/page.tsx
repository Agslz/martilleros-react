"use client"

import { useEffect, useState } from "react"
import { Wallet, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getPagos, crearPago, type PagoResponse, type TipoPago } from "@/lib/api"

function formatFecha(s: string) {
  try {
    return new Date(s).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return s
  }
}

const TIPOS: TipoPago[] = ["MATRICULA", "CUOTA", "OTRO"]

export default function PanelPagosPage() {
  const [list, setList] = useState<PagoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    tipoPago: "CUOTA" as TipoPago,
    monto: 0,
    descripcion: "",
  })

  const load = () => {
    setLoading(true)
    getPagos()
      .then(setList)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setCreating(true)
    try {
      const created = await crearPago({
        tipoPago: form.tipoPago,
        monto: form.monto,
        descripcion: form.descripcion || undefined,
      })
      if (created) {
        setSuccess("Solicitud de pago creada.")
        setForm({ tipoPago: "CUOTA", monto: 0, descripcion: "" })
        load()
      } else {
        setError("No se pudo crear la solicitud.")
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear el pago.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis pagos</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="max-w-xl rounded-xl border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Nueva solicitud de pago
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de pago</Label>
            <Select
              value={form.tipoPago}
              onValueChange={(v) => setForm({ ...form, tipoPago: v as TipoPago })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              min={1}
              required
              value={form.monto || ""}
              onChange={(e) =>
                setForm({ ...form, monto: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Input
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Crear solicitud
          </Button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-primary" />
        Historial
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">No hay pagos.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Tipo</th>
                <th className="text-left p-4 font-semibold">Monto</th>
                <th className="text-left p-4 font-semibold">Estado</th>
                <th className="text-left p-4 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium">{p.tipoPago}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format(p.monto)}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        p.estado === "PAGADO"
                          ? "text-green-600"
                          : p.estado === "CANCELADO"
                            ? "text-muted-foreground"
                            : "text-amber-600"
                      }
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatFecha(p.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
