"use client"

import { useEffect, useState } from "react"
import { CreditCard, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCuotas, pagarCupon, crearSuscripcionCuota, type CuotaItemResponse } from "@/lib/api"

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

export default function PanelCuotasPage() {
  const [list, setList] = useState<CuotaItemResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionPeriodo, setActionPeriodo] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getCuotas()
      .then(setList)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handlePagarCupon = async (periodo: string) => {
    setError(null)
    setActionPeriodo(periodo)
    try {
      const res = await pagarCupon(periodo)
      if (res?.initPoint) {
        window.location.href = res.initPoint
        return
      }
      setError("No se obtuvo el link de pago.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al solicitar cupón.")
    } finally {
      setActionPeriodo(null)
    }
  }

  const handleSuscripcion = async () => {
    setError(null)
    setActionPeriodo("suscripcion")
    try {
      const res = await crearSuscripcionCuota()
      if (res?.initPoint) {
        window.location.href = res.initPoint
        return
      }
      setError("No se obtuvo el link de suscripción.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear suscripción.")
    } finally {
      setActionPeriodo(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis cuotas</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <Button
          variant="outline"
          onClick={handleSuscripcion}
          disabled={actionPeriodo !== null}
        >
          {actionPeriodo === "suscripcion" ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          Suscripción (débito automático)
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">No hay cuotas cargadas.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Período</th>
                <th className="text-left p-4 font-semibold">Monto</th>
                <th className="text-left p-4 font-semibold">Vencimiento</th>
                <th className="text-left p-4 font-semibold">Estado</th>
                <th className="text-right p-4 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.periodo} className="border-t border-border">
                  <td className="p-4 font-medium">{c.periodo}</td>
                  <td className="p-4">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format(c.monto)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatFecha(c.fechaVencimiento)}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        c.estado === "PAGADO"
                          ? "text-green-600"
                          : c.estado === "VENCIDO"
                            ? "text-destructive"
                            : "text-amber-600"
                      }
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {c.estado === "PENDIENTE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePagarCupon(c.periodo)}
                        disabled={actionPeriodo !== null}
                      >
                        {actionPeriodo === c.periodo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Pagar cupón
                          </>
                        )}
                      </Button>
                    )}
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
