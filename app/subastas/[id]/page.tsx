import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building,
  Car,
  Package,
  CheckCircle,
  FileText,
  ExternalLink,
} from "lucide-react"
import { PublicLayout } from "@/components/layout/public-layout"
import { SubastaGallery } from "@/components/subastas/subasta-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSubastaById } from "@/lib/api"

interface SubastaDetailPageProps {
  params: Promise<{ id: string }>
}

function formatFecha(isoDate: string) {
  try {
    const d = new Date(isoDate + "T12:00:00")
    return d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return isoDate
  }
}

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export async function generateMetadata({ params }: SubastaDetailPageProps) {
  const { id } = await params
  const subasta = await getSubastaById(Number(id))
  if (!subasta) return { title: "Subasta no encontrada" }
  return {
    title: `${subasta.titulo} | Colegio de Martilleros de Mendoza`,
    description: subasta.descripcion,
  }
}

export default async function SubastaDetailPage({ params }: SubastaDetailPageProps) {
  const { id } = await params
  const subasta = await getSubastaById(Number(id))

  if (!subasta) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const esProxima = subasta.fechaFin >= today

  const imagenesParaGaleria = subasta.imagenes?.map((img) => ({
    id: img.id,
    url: img.fileUrl,
    alt: img.fileName || subasta.titulo,
  })) ?? []

  return (
    <PublicLayout>
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
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {esProxima ? (
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
                <p className="text-lg text-muted-foreground">{subasta.descripcion}</p>
              </div>

              <SubastaGallery
                imagenes={imagenesParaGaleria}
                titulo={subasta.titulo}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Descripción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {subasta.descripcion}
                  </p>
                </CardContent>
              </Card>

              {subasta.edictoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Edicto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild>
                      <a
                        href={subasta.edictoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver edicto (PDF)
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">Precio inicial</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrecio(subasta.precioInicial)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fecha y Lugar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Inicio: {formatFecha(subasta.fechaInicio)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cierre: {formatFecha(subasta.fechaFin)}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.domicilio}</p>
                      <p className="text-sm text-muted-foreground">Domicilio de la subasta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Martillero a cargo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{subasta.nombreMartillero}</p>
                      <p className="text-sm text-muted-foreground">
                        Matrícula: {subasta.martilleroACargo}
                      </p>
                      {subasta.cuitMartillero && (
                        <p className="text-sm text-muted-foreground">
                          CUIT: {subasta.cuitMartillero}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-green-800 text-sm">Martillero verificado</p>
                  <p className="text-xs text-green-600">
                    Matriculado y habilitado por el Colegio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
