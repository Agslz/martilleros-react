"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, ArrowRight, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SubastaResponse } from "@/lib/api"
import {
  edictoTienePublicacionesPendientes,
  formatFechasEdictoListado,
  getCantidadPublicaciones,
} from "@/lib/subasta-display"

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function getEstado(subasta: SubastaResponse) {
  if (subasta.visiblePublico) return "vigente"
  return edictoTienePublicacionesPendientes(subasta) ? "proxima" : "finalizada"
}

interface SubastasListProps {
  subastas: SubastaResponse[]
}

export function SubastasList({ subastas }: SubastasListProps) {
  if (subastas.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground rounded-xl border border-border bg-card">
        No hay edictos para mostrar con el filtro seleccionado.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {subastas.map((subasta) => {
        const estado = getEstado(subasta)
        const primeraImagen = subasta.imagenes?.[0]

        return (
          <article
            key={subasta.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row">
              {primeraImagen && (
                <Link
                  href={`/edictos/${subasta.id}`}
                  className="relative w-full md:w-64 h-48 md:h-auto shrink-0"
                >
                  <Image
                    src={primeraImagen.fileUrl || "/placeholder.svg"}
                    alt={primeraImagen.fileName || subasta.titulo}
                    fill
                    className="object-cover"
                    unoptimized={primeraImagen.fileUrl?.startsWith("http")}
                  />
                  <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                    {subasta.imagenes?.length ?? 0} fotos
                  </div>
                </Link>
              )}

              <div className="p-6 flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Package className="h-7 w-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {estado === "vigente" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Publicado hoy
                        </Badge>
                      ) : estado === "proxima" ? (
                        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
                          Próximo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Finalizado
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {subasta.titulo}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {subasta.descripcion}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">
                          {formatFechasEdictoListado(subasta)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{subasta.domicilio}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Base: </span>
                        <span className="font-semibold text-foreground">
                          {formatPrecio(subasta.precioInicial)}
                        </span>
                      </div>
                      {getCantidadPublicaciones(subasta) > 0 && (
                        <div>
                          <span className="text-muted-foreground">
                            Publicaciones BO:{" "}
                          </span>
                          <span className="font-medium text-foreground">
                            {getCantidadPublicaciones(subasta)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Martillero: </span>
                        <span className="font-medium text-foreground">
                          {subasta.nombreMartillero}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({subasta.martilleroACargo})
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/edictos/${subasta.id}`}>
                          Ver Detalle
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
