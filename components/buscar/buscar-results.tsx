"use client"

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import type { MatriculadoPublicResponse } from "@/lib/api"
import { matriculaPuedeEjercer } from "@/lib/estado-fianza"
import { displayTelefono } from "@/lib/telefono"

function estadoHabilitado(m: MatriculadoPublicResponse) {
  return matriculaPuedeEjercer(m)
}

type InfoItem = {
  label: string
  value: string
  icon: LucideIcon
}

function buildInfoItems(matriculado: MatriculadoPublicResponse): InfoItem[] {
  const items: InfoItem[] = []

  const matricula = matriculado.matricula?.trim()
  if (matricula) {
    items.push({
      label: "Matrícula",
      value: matricula,
      icon: CheckCircle2,
    })
  }

  const email = matriculado.email?.trim()
  if (email) {
    items.push({
      label: "Correo",
      value: email,
      icon: Mail,
    })
  }

  const telefono = matriculado.telefono?.trim()
  if (telefono) {
    items.push({
      label: "Número de teléfono",
      value: displayTelefono(telefono),
      icon: Phone,
    })
  }

  return items
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
        const infoItems = buildInfoItems(matriculado)

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
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">
                      No habilitado para ejercer
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                {matriculado.fotoCarnetUrl ? (
                  <img
                    src={matriculado.fotoCarnetUrl}
                    alt={`Foto de ${matriculado.nombre} ${matriculado.apellido}`}
                    className="h-16 w-16 rounded-full object-cover border border-border shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shrink-0">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 pt-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {matriculado.apellido}, {matriculado.nombre}
                  </h3>
                </div>
              </div>

              {infoItems.length > 0 && (
                <ul className="space-y-2">
                  {infoItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <li
                        key={item.label}
                        className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/10 px-4 py-3"
                      >
                        <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed min-w-0">
                          <span className="font-semibold text-primary">
                            {item.label}:
                          </span>{" "}
                          <span className="font-medium text-foreground break-all">
                            {item.value}
                          </span>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
