"use client"

import { useEffect, useState } from "react"
import { CreditCard, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MercadoPagoLogo } from "@/components/ui/mercado-pago-logo"
import { getCuotas, pagarCupon, crearSuscripcionCuota, type CuotaItemResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
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
        toast({
          title: "Redirigiendo",
          description: "Redirigiendo a Mercado Pago para completar el pago.",
        })
        window.location.href = res.initPoint
        return
      }
      setError("No se obtuvo el link de pago.")
      toast({
        title: "Error",
        description: "No se pudo procesar. Intente de nuevo.",
        variant: "destructive",
      })
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al solicitar cupón.")
      toast({
        title: "Error",
        description: "No se pudo procesar. Intente de nuevo.",
        variant: "destructive",
      })
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
        toast({
          title: "Suscripción",
          description: "Suscripción a débito automático solicitada.",
        })
        window.location.href = res.initPoint
        return
      }
      setError("No se obtuvo el link de suscripción.")
      toast({
        title: "Error",
        description: "No se pudo procesar. Intente de nuevo.",
        variant: "destructive",
      })
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al crear suscripción.")
      toast({
        title: "Error",
        description: "No se pudo procesar. Intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setActionPeriodo(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Mis cuotas</h1>
      <p className="text-muted-foreground mb-6">
        El pago de la cuota al Colegio se realiza con Mercado Pago. Podés adherirte al débito automático o generar un cupón de pago.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <MercadoPagoLogo height={28} className="shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Pagar con Mercado Pago
              </h2>
              <p className="text-sm text-muted-foreground">
                Dos opciones: débito automático o cupón de pago (PagoFácil / Rapipago).
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button
            variant="default"
            onClick={handleSuscripcion}
            disabled={actionPeriodo !== null}
          >
            {actionPeriodo === "suscripcion" ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            Adherirse al débito automático (Mercado Pago)
          </Button>
          <span className="text-sm text-muted-foreground self-center">o</span>
          <p className="text-sm text-muted-foreground self-center w-full sm:w-auto">
            Generar cupón de pago (Mercado Pago) por período en la tabla debajo.
          </p>
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
            El botón <strong>Generar cupón</strong> aparece en la tabla cuando existan períodos (ej. 2025-01, 2025-02) creados por el Colegio desde el panel de administración. Mientras no haya períodos, solo podés usar <strong>Adherirse al débito automático</strong> si está disponible.
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
                        title="Generar cupón de pago con Mercado Pago"
                      >
                        {actionPeriodo === c.periodo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Generar cupón
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
