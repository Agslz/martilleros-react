"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Gavel, Loader2, Plus, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSubastasPrivadas, getCurrentUser } from "@/lib/api"
import type { SubastaResponse } from "@/lib/api"
import {
  formatFechasEdictoListado,
  getCantidadPublicaciones,
  edictoVisibleEnSitioHoy,
} from "@/lib/subasta-display"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function PanelEdictosPage() {
  const { toast } = useToast()
  const [allSubastas, setAllSubastas] = useState<SubastaResponse[]>([])
  const [matricula, setMatricula] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubastasPrivadas(), getCurrentUser()])
      .then(([subastas, user]) => {
        setAllSubastas(subastas)
        setMatricula(user?.matricula ?? null)
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "No se pudo cargar el listado de edictos.",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [toast])

  const misEdictos =
    matricula != null
      ? allSubastas.filter(
          (s) => s.martilleroACargo.toUpperCase() === matricula.toUpperCase()
        )
      : []

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gavel className="h-7 w-7 text-primary" />
          Mis edictos
        </h1>
        <Button asChild>
          <Link href="/panel/subastas/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo edicto
          </Link>
        </Button>
      </div>

      <p className="text-muted-foreground mb-8">
        Historial de edictos creados a su nombre. Podés ver el detalle en el sitio
        público.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : misEdictos.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No hay edictos creados por usted.</p>
          <p className="text-sm mt-2">
            Creá un edicto con el botón &quot;Nuevo edicto&quot; para que aparezca
            aquí.
          </p>
          <Button asChild className="mt-6">
            <Link href="/panel/subastas/nueva">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo edicto
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Título</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">
                  Base
                </th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">
                  Publicaciones BO
                </th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">
                  Días de publicación
                </th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">
                  En sitio hoy
                </th>
                <th className="text-right p-4 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {misEdictos.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-4 font-medium">{s.titulo}</td>
                  <td className="p-4 hidden md:table-cell">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format(s.precioInicial)}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground text-sm">
                    {getCantidadPublicaciones(s)}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm hidden lg:table-cell">
                    {formatFechasEdictoListado(s)}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {edictoVisibleEnSitioHoy(s) ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        No
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild={s.visiblePublico && edictoVisibleEnSitioHoy(s)}
                      disabled={!s.visiblePublico || !edictoVisibleEnSitioHoy(s)}
                      title={
                        s.visiblePublico && edictoVisibleEnSitioHoy(s)
                          ? "Ver en el sitio público"
                          : "Solo visible en el sitio los días de publicación elegidos"
                      }
                    >
                      {s.visiblePublico && edictoVisibleEnSitioHoy(s) ? (
                        <Link
                          href={`/edictos/${s.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ver en sitio
                        </Link>
                      ) : (
                        <span>
                          <ExternalLink className="h-4 w-4 mr-1 inline" />
                          Ver en sitio
                        </span>
                      )}
                    </Button>
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
