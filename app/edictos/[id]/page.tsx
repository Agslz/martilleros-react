import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react"
import { PublicLayout } from "@/components/layout/public-layout"
import { SubastaGallery } from "@/components/subastas/subasta-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSubastaById, getMatriculadosPublicos } from "@/lib/api"
import type { MatriculadoPublicResponse } from "@/lib/api"
import { matriculaPuedeEjercer } from "@/lib/estado-fianza"
import {
  edictoTienePublicacionesPendientes,
  edictoVisibleEnSitioHoy,
} from "@/lib/subasta-display"
import { displayTelefono } from "@/lib/telefono"

interface SubastaDetailPageProps {
  params: Promise<{ id: string }>
}

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export async function generateMetadata({
  params,
}: SubastaDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const subasta = await getSubastaById(Number(id))
  if (!subasta) {
    return { title: "Edicto no encontrado", robots: { index: false, follow: false } }
  }
  const path = `/edictos/${id}`
  const base = getSiteUrl()
  return {
    title: subasta.titulo,
    description:
      subasta.descripcion.length > 160
        ? `${subasta.descripcion.slice(0, 157)}…`
        : subasta.descripcion,
    alternates: { canonical: path },
    openGraph: {
      title: subasta.titulo,
      description: subasta.descripcion.slice(0, 200),
      url: `${base}${path}`,
      type: "article",
    },
  }
}

function habilitadoParaEjercer(m: MatriculadoPublicResponse | null) {
  if (!m) return null
  return matriculaPuedeEjercer(m)
}

export default async function SubastaDetailPage({ params }: SubastaDetailPageProps) {
  const { id } = await params
  const subasta = await getSubastaById(Number(id))

  if (!subasta) notFound()

  const esVigenteHoy = edictoVisibleEnSitioHoy(subasta)
  const tienePendientes = edictoTienePublicacionesPendientes(subasta)

  const tieneEdictoTexto =
    typeof subasta.edictoTexto === "string" &&
    subasta.edictoTexto.trim().length > 0
  const tieneEdictoPdf =
    typeof subasta.edictoUrl === "string" && subasta.edictoUrl.trim().length > 0

  const imagenesParaGaleria =
    subasta.imagenes?.map((img) => ({
      id: img.id,
      url: img.fileUrl,
      alt: img.fileName || subasta.titulo,
    })) ?? []

  let martillero: MatriculadoPublicResponse | null = null
  try {
    const todos = await getMatriculadosPublicos()
    martillero =
      todos.find(
        (m) =>
          m.matricula.toUpperCase() === subasta.martilleroACargo.toUpperCase()
      ) ?? null
  } catch {
    martillero = null
  }

  const habilitado = habilitadoParaEjercer(martillero)

  return (
    <PublicLayout>
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/edictos"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado de edictos
          </Link>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {esVigenteHoy ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Publicado hoy
                    </Badge>
                  ) : tienePendientes ? (
                    <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
                      Próximo a publicarse
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Finalizado
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance">
                  {subasta.titulo}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {subasta.descripcion}
                </p>
              </div>

              {imagenesParaGaleria.length > 0 && (
                <SubastaGallery
                  imagenes={imagenesParaGaleria}
                  titulo={subasta.titulo}
                />
              )}

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    Edicto
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-normal">
                    Texto publicado en el Boletín Oficial de Mendoza
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tieneEdictoTexto ? (
                    <>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {subasta.edictoTexto}
                      </p>
                      {tieneEdictoPdf && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={subasta.edictoUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver edicto (PDF)
                          </a>
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        El texto del edicto aún no está disponible.
                      </p>
                      {tieneEdictoPdf && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={subasta.edictoUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver edicto (PDF)
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Base</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrecio(subasta.precioInicial)}
                    </p>
                  </div>
                  {subasta.incrementos != null && subasta.incrementos > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Incrementos
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {formatPrecio(subasta.incrementos)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Martillero a cargo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {subasta.numeroEdicto && (
                    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        Número de edicto
                      </p>
                      <p className="text-sm font-medium">{subasta.numeroEdicto}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
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
                      {subasta.telefonoMartillero && (
                        <p className="text-sm text-muted-foreground">
                          Teléfono: {displayTelefono(subasta.telefonoMartillero)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ubicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{subasta.domicilio}</p>
                      <p className="text-sm text-muted-foreground">
                        Domicilio del remate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {habilitado === true && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 text-sm">
                      Martillero habilitado para ejercer
                    </p>
                    <p className="text-xs text-green-600">
                      Matriculado con credencial activa según el padrón público.
                    </p>
                  </div>
                </div>
              )}
              {habilitado === false && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 text-sm">
                      Martillero no habilitado para ejercer
                    </p>
                    <p className="text-xs text-red-600">
                      Estado según el padrón público.
                    </p>
                  </div>
                </div>
              )}
              {habilitado === null && (
                <div className="flex items-center gap-3 p-4 bg-muted/40 border border-border rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Martillero matriculado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No se pudo verificar el estado en el padrón público.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
