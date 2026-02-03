import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, Mail, Building, Car, Package, CheckCircle, FileText, AlertCircle } from "lucide-react"
import { PublicLayout } from "@/components/layout/public-layout"
import { SubastaGallery } from "@/components/subastas/subasta-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSubastaById } from "@/lib/data/subastas"

interface SubastaDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SubastaDetailPageProps) {
  const { id } = await params
  const subasta = getSubastaById(Number(id))
  
  if (!subasta) {
    return { title: "Subasta no encontrada" }
  }

  return {
    title: `${subasta.titulo} | Colegio de Martilleros de Mendoza`,
    description: subasta.descripcion,
  }
}

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

export default async function SubastaDetailPage({ params }: SubastaDetailPageProps) {
  const { id } = await params
  const subasta = getSubastaById(Number(id))

  if (!subasta) {
    notFound()
  }

  const CategoryIcon = getCategoryIcon(subasta.categoria)

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/subastas" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado de subastas
          </Link>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery and Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CategoryIcon className="h-3 w-3" />
                    {getCategoryLabel(subasta.categoria)}
                  </Badge>
                  {subasta.estado === "proxima" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Próxima Subasta
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Subasta Realizada
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
                  {subasta.titulo}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {subasta.descripcion}
                </p>
              </div>

              {/* Gallery */}
              <SubastaGallery imagenes={subasta.imagenes} titulo={subasta.titulo} />

              {/* Full Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Descripción Completa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {subasta.descripcionCompleta}
                  </p>

                  {/* Property-specific details */}
                  {subasta.categoria === "inmuebles" && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {subasta.superficie && (
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-sm text-muted-foreground">Superficie</p>
                          <p className="font-semibold">{subasta.superficie}</p>
                        </div>
                      )}
                      {subasta.ambientes && (
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-sm text-muted-foreground">Ambientes</p>
                          <p className="font-semibold">{subasta.ambientes}</p>
                        </div>
                      )}
                      {subasta.antiguedad && (
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-sm text-muted-foreground">Antigüedad</p>
                          <p className="font-semibold">{subasta.antiguedad}</p>
                        </div>
                      )}
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-muted-foreground">Cochera</p>
                        <p className="font-semibold">{subasta.cochera ? "Sí" : "No"}</p>
                      </div>
                    </div>
                  )}

                  {subasta.categoria === "muebles" && subasta.cantidadLotes && (
                    <div className="mt-6">
                      <div className="bg-muted/50 rounded-lg p-4 inline-block">
                        <p className="text-sm text-muted-foreground">Total de Lotes</p>
                        <p className="text-2xl font-bold text-primary">{subasta.cantidadLotes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products/Items List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {subasta.categoria === "muebles" ? "Lotes a Subastar" : "Bienes a Subastar"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subasta.productos.map((producto) => (
                      <div 
                        key={producto.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-2"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{producto.nombre}</h4>
                          <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
                        </div>
                        {producto.valorEstimado && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Valor estimado</p>
                            <p className="font-semibold text-primary">{producto.valorEstimado}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Condiciones de la Subasta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {subasta.condiciones.map((condicion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{condicion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documentación Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subasta.documentacion.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Base Mínima</p>
                  <p className="text-3xl font-bold text-primary">{subasta.baseMinima}</p>
                </CardContent>
              </Card>

              {/* Date and Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Fecha y Lugar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.fecha}</p>
                      <p className="text-sm text-muted-foreground">Fecha de la subasta</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.hora}</p>
                      <p className="text-sm text-muted-foreground">Hora de inicio</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.lugar}</p>
                      <p className="text-sm text-muted-foreground">{subasta.direccion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auctioneer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Martillero a Cargo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.martillero}</p>
                      <p className="text-sm text-muted-foreground">Matrícula: {subasta.matricula}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.telefono}</p>
                      <p className="text-sm text-muted-foreground">Teléfono de contacto</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm break-all">{subasta.email}</p>
                      <p className="text-sm text-muted-foreground">Correo electrónico</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              {subasta.estado === "proxima" && (
                <Card className="bg-institutional-navy text-white">
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-lg mb-2">¿Interesado en participar?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Contacte al martillero para obtener más información y coordinar una visita.
                    </p>
                    <Button variant="secondary" className="w-full" asChild>
                      <a href={`tel:${subasta.telefono.replace(/[^0-9]/g, "")}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar Ahora
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Verification Badge */}
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-green-800 text-sm">Martillero Verificado</p>
                  <p className="text-xs text-green-600">Matriculado y habilitado por el Colegio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
