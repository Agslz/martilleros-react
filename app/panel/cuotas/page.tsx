"use client"

import { useEffect, useState } from "react"
import { CreditCard, Loader2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCuotas, type CuotaItemResponse } from "@/lib/api"

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

function labelMetodoPago(metodo?: string) {
  if (!metodo) return null
  const map: Record<string, string> = {
    SUSCRIPCION: "Débito automático",
    CUPON_EFECTIVO: "Cupón en efectivo",
    PAGOS360: "Pagos360",
    MANUAL: "Registrado por el Colegio",
  }
  return map[metodo] ?? metodo
}

export default function PanelCuotasPage() {
  const [list, setList] = useState<CuotaItemResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCuotas()
      .then(setList)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Mis cuotas</h1>
      <p className="text-muted-foreground mb-6">
        Consultá el estado de tus cuotas al Colegio. El pago en línea se habilitará
        próximamente.
      </p>

      <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Pago en línea — próximamente
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                El cobro digital de cuotas con Mercado Pago ya no está disponible.
                Estamos integrando <strong>Pagos360</strong> para débito y cupones.
                Mientras tanto, coordiná el pago con la administración del Colegio si
                tenés una cuota pendiente.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span>No hay acciones de pago disponibles en esta pantalla por ahora.</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold text-foreground mb-3">Períodos y estado</h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-border p-6 text-muted-foreground space-y-2">
          <p>No hay períodos de cuota cargados.</p>
          <p className="text-sm">
            Cuando el Colegio publique períodos desde el panel de administración,
            aparecerán aquí con su monto, vencimiento y estado.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Período</th>
                <th className="text-left p-4 font-semibold">Monto</th>
                <th className="text-left p-4 font-semibold">Vencimiento</th>
                <th className="text-left p-4 font-semibold">Estado</th>
                <th className="text-left p-4 font-semibold">Forma de pago</th>
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
                  <td className="p-4 text-sm text-muted-foreground">
                    {labelMetodoPago(c.metodoPago) ?? "—"}
                    {c.paidAt && (
                      <span className="block text-xs">
                        Pagado: {formatFecha(c.paidAt.slice(0, 10))}
                      </span>
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
