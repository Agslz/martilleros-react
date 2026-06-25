"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SubastaResponse } from "@/lib/api"
import {
  edictoTienePublicacionesPendientes,
  edictoVisibleEnSitioHoy,
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
  if (edictoVisibleEnSitioHoy(subasta)) return "vigente"
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
                  className="relative w-full md:w-48 h-40 md:h-auto md:min-h-[140px] shrink-0"
                >
                  <Image
                    src={primeraImagen.fileUrl || "/placeholder.svg"}
                    alt={primeraImagen.fileName || subasta.titulo}
                    fill
                    className="object-cover"
                    unoptimized={primeraImagen.fileUrl?.startsWith("http")}
                  />
                </Link>
              )}

              <div className="p-5 flex-1 flex flex-col sm:flex-row sm:items-stretch gap-4 min-w-0">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
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

                  <h2 className="text-lg font-semibold text-foreground leading-snug">
                    <Link
                      href={`/edictos/${subasta.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {subasta.titulo}
                    </Link>
                  </h2>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {subasta.descripcion}
                  </p>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground pt-1">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{subasta.domicilio}</span>
                  </div>
                </div>

                <div className="sm:text-right sm:pl-4 sm:border-l border-border shrink-0 flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground mb-0.5">Base</p>
                  <p className="text-2xl font-bold text-primary whitespace-nowrap">
                    {formatPrecio(subasta.precioInicial)}
                  </p>
                  {subasta.incrementos != null && subasta.incrementos > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground mt-2 mb-0.5">
                        Incrementos
                      </p>
                      <p className="text-base font-semibold text-foreground whitespace-nowrap">
                        {formatPrecio(subasta.incrementos)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border mt-0 mx-5 pt-4">
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
          </article>
        )
      })}
    </div>
  )
}
