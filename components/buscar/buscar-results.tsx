"use client"

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { MatriculadoPublicResponse } from "@/lib/api"

function estadoHabilitado(m: MatriculadoPublicResponse) {
  if (!m.habilitado) return false
  return m.estadoFianza === "ACTIVA"
}

interface BuscarResultsProps {
  results: MatriculadoPublicResponse[] | null
  loading: boolean
  searched: boolean
}

export function BuscarResults({
  results,
  loading,
  searched,
}: BuscarResultsProps) {
  if (!searched) return null
  if (loading) {
    return (
      <div className="mt-8 flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (results === null) return null

  if (results.length === 0) {
    return (
      <div className="mt-8">
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No se encontraron resultados
          </h3>
          <p className="mt-2 text-muted-foreground">
            No existe un martillero con los datos ingresados en nuestro registro.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      {results.map((matriculado) => {
        const habilitado = estadoHabilitado(matriculado)
        return (
          <div
            key={matriculado.id}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div
              className={`px-6 py-4 flex items-center gap-3 ${
                habilitado
                  ? "bg-green-50 border-b border-green-100"
                  : "bg-red-50 border-b border-red-100"
              }`}
            >
              {habilitado ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">
                      Martillero habilitado para ejercer
                    </p>
                    <p className="text-sm text-green-600">
                      Fianza activa · Puede ejercer en Mendoza
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">
                      No habilitado para ejercer
                    </p>
                    <p className="text-sm text-red-600">
                      {!matriculado.habilitado
                        ? "Matriculado no habilitado"
                        : `Fianza: ${matriculado.estadoFianza}`}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {matriculado.apellido}, {matriculado.nombre}
                  </h3>
                  <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/10">
                    {matriculado.matricula}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matriculado.email && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground break-all">
                        {matriculado.email}
                      </p>
                    </div>
                  </div>
                )}
                {matriculado.cuit && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">CUIT</p>
                      <p className="font-medium text-foreground">
                        {matriculado.cuit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
