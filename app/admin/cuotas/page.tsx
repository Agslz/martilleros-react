"use client"

import { useEffect, useState } from "react"
import { CreditCard, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  crearPeriodoCuota,
  getEstadoCuotasPorPeriodo,
  type CuotaPeriodoRequest,
  type CuotaEstadoItemResponse,
} from "@/lib/api"

function formatFecha(s: string) {
  try {
    return new Date(s + "T12:00:00").toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return s
  }
}

export default function AdminCuotasPage() {
  const [loading, setLoading] = useState(false)
  const [loadingEstado, setLoadingEstado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [periodoConsulta, setPeriodoConsulta] = useState("")
  const [estadoList, setEstadoList] = useState<CuotaEstadoItemResponse[]>([])
  const [form, setForm] = useState<CuotaPeriodoRequest>({
    periodo: "",
    monto: 0,
    fechaVencimiento: "",
  })

  const handleCrearPeriodo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await crearPeriodoCuota(form)
      setSuccess("Período creado.")
      setForm({ periodo: "", monto: 0, fechaVencimiento: "" })
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear período.")
    } finally {
      setLoading(false)
    }
  }

  const handleConsultarEstado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!periodoConsulta.trim()) return
    setLoadingEstado(true)
    try {
      const list = await getEstadoCuotasPorPeriodo(periodoConsulta.trim())
      setEstadoList(list)
    } catch {
      setEstadoList([])
    } finally {
      setLoadingEstado(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">Cuotas</h1>

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

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Crear período
          </h2>
          <form onSubmit={handleCrearPeriodo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="periodo">Período (YYYY-MM)</Label>
              <Input
                id="periodo"
                placeholder="2026-03"
                required
                value={form.periodo}
                onChange={(e) => setForm({ ...form, periodo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                min={0}
                required
                value={form.monto || ""}
                onChange={(e) =>
                  setForm({ ...form, monto: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha vencimiento (YYYY-MM-DD)</Label>
              <Input
                id="fechaVencimiento"
                type="date"
                required
                value={form.fechaVencimiento}
                onChange={(e) =>
                  setForm({ ...form, fechaVencimiento: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Crear período
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Estado por período
          </h2>
          <form onSubmit={handleConsultarEstado} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="periodoConsulta">Período (YYYY-MM)</Label>
              <div className="flex gap-2">
                <Input
                  id="periodoConsulta"
                  placeholder="2026-01"
                  value={periodoConsulta}
                  onChange={(e) => setPeriodoConsulta(e.target.value)}
                />
                <Button type="submit" disabled={loadingEstado}>
                  {loadingEstado ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Consultar"
                  )}
                </Button>
              </div>
            </div>
          </form>
          {estadoList.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-semibold">Matrícula</th>
                    <th className="text-left p-2 font-semibold">Nombre</th>
                    <th className="text-left p-2 font-semibold">Estado</th>
                    <th className="text-left p-2 font-semibold">Pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {estadoList.map((item, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2 font-medium">{item.matricula}</td>
                      <td className="p-2 text-muted-foreground">
                        {item.apellido}, {item.nombre}
                      </td>
                      <td className="p-2">
                        <span
                          className={
                            item.estado === "PAGADO"
                              ? "text-green-600"
                              : item.estado === "VENCIDO"
                                ? "text-destructive"
                                : "text-amber-600"
                          }
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {item.paidAt ? formatFecha(item.paidAt) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
