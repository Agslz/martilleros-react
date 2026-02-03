import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock, ArrowRight, Building, Car, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { subastas } from "@/lib/data/subastas"

const getCategoryIcon = (categoria: string) => {
  switch (categoria) {
    case "inmuebles":
      return Building
    case "vehiculos":
      return Car
    default:
      return Package
  }
}

const getCategoryLabel = (categoria: string) => {
  switch (categoria) {
    case "inmuebles":
      return "Inmuebles"
    case "vehiculos":
      return "Vehículos"
    case "muebles":
      return "Muebles"
    default:
      return "Otros"
  }
}

export function SubastasList() {
  return (
    <div className="space-y-6">
      {subastas.map((subasta) => {
        const CategoryIcon = getCategoryIcon(subasta.categoria)
        
        return (
          <article 
            key={subasta.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail Image */}
              {subasta.imagenes && subasta.imagenes.length > 0 && (
                <Link href={`/subastas/${subasta.id}`} className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
                  <Image
                    src={subasta.imagenes[0].url || "/placeholder.svg"}
                    alt={subasta.imagenes[0].alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                    {subasta.imagenes.length} fotos
                  </div>
                </Link>
              )}
              
              <div className="p-6 flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Category Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <CategoryIcon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {getCategoryLabel(subasta.categoria)}
                      </Badge>
                      {subasta.estado === "proxima" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Próxima
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Realizada
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {subasta.titulo}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {subasta.descripcion}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{subasta.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{subasta.hora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{subasta.lugar}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Base: </span>
                        <span className="font-semibold text-foreground">{subasta.baseMinima}</span>
                      </div>
                    </div>

                    {/* Martillero */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Martillero: </span>
                        <span className="font-medium text-foreground">{subasta.martillero}</span>
                        <span className="text-muted-foreground ml-2">({subasta.matricula})</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/subastas/${subasta.id}`}>
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

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline">
          Cargar más subastas
        </Button>
      </div>
    </div>
  )
}
