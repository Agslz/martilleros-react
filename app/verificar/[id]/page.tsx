"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react"
import { getVerificacionCuotaPublica } from "@/lib/api"
import type { VerificacionCuotaPublicResponse } from "@/lib/api/types"
import { etiquetaEstadoSocio } from "@/lib/estado-socio"

function estiloPorEstado(estado: VerificacionCuotaPublicResponse["estadoSocio"]) {
  switch (estado) {
    case "SOCIO_AL_DIA":
      return {
        wrap: "bg-green-50 border-green-200 text-green-900",
        icon: CheckCircle2,
        iconClass: "text-green-600",
      }
    case "SOCIO_CON_DEUDA":
      return {
        wrap: "bg-amber-50 border-amber-200 text-amber-950",
        icon: AlertTriangle,
        iconClass: "text-amber-600",
      }
    case "SOCIO_DADO_DE_BAJA":
      return {
        wrap: "bg-red-50 border-red-200 text-red-900",
        icon: XCircle,
        iconClass: "text-red-600",
      }
    default:
      return {
        wrap: "bg-muted border-border text-foreground",
        icon: AlertTriangle,
        iconClass: "text-muted-foreground",
      }
  }
}

export default function VerificarCuotaPage() {
  const params = useParams()
  const rawId = params?.id
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId)

  const [data, setData] = useState<VerificacionCuotaPublicResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Enlace inválido")
      setLoading(false)
      return
    }
    setLoading(true)
    getVerificacionCuotaPublica(id)
      .then(setData)
      .catch((err: Error) => {
        setError(err.message || "No se encontró el socio")
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="w-full max-w-md">
        <p className="text-center text-sm text-muted-foreground mb-4">
          Colegio de Martilleros — verificación de cuota
        </p>

        {loading && (
          <div className="rounded-xl border bg-card p-10 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Consultando estado…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-900">
            <XCircle className="h-10 w-10 mx-auto mb-3 text-red-600" />
            <p className="font-semibold">No se pudo verificar</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && data && (
          <div
            className={`rounded-xl border p-8 text-center shadow-sm ${estiloPorEstado(data.estadoSocio).wrap}`}
          >
            {(() => {
              const { icon: Icon, iconClass } = estiloPorEstado(data.estadoSocio)
              return <Icon className={`h-12 w-12 mx-auto mb-4 ${iconClass}`} />
            })()}
            <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
              Socio
            </p>
            <h1 className="text-2xl font-bold break-words">
              {data.apellido}, {data.nombre}
            </h1>
            <p className="mt-2 text-sm opacity-80">
              Matrícula <span className="font-semibold">{data.matricula}</span>
            </p>
            <div className="mt-6 rounded-lg bg-white/70 px-4 py-3 border border-black/5">
              <p className="text-xs uppercase tracking-wide opacity-60 mb-1">
                Estado
              </p>
              <p className="text-xl font-bold">
                {etiquetaEstadoSocio(data.estadoSocio)}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
