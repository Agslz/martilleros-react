"use client"

import { FileText, MapPin, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EdictoPreviewDraft } from "@/lib/edicto-preview"
import { displayCuit } from "@/lib/cuit"
import { displayTelefono } from "@/lib/telefono"

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

type EdictoVistaPreviaProps = {
  draft: EdictoPreviewDraft
  esPreview?: boolean
}

export function EdictoVistaPrevia({ draft, esPreview = false }: EdictoVistaPreviaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {esPreview && (
          <Badge variant="secondary" className="mb-2">
            Vista previa — aún no publicado
          </Badge>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {draft.titulo || "Sin título"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {draft.descripcion || "Sin descripción"}
          </p>
        </div>

        {draft.imagenUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {draft.imagenUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url + i}
                src={url}
                alt={`Vista previa ${i + 1}`}
                className="rounded-lg border border-border aspect-video object-cover w-full"
              />
            ))}
          </div>
        )}

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Edicto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {draft.edictoTexto || "Sin texto de edicto."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Base</p>
              <p className="text-3xl font-bold text-primary">
                {draft.precioInicial > 0
                  ? formatPrecio(draft.precioInicial)
                  : "—"}
              </p>
            </div>
            {draft.incrementos != null && draft.incrementos > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Incrementos</p>
                <p className="text-xl font-semibold text-foreground">
                  {formatPrecio(draft.incrementos)}
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
            {draft.numeroEdicto && (
              <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
                <p className="text-xs text-muted-foreground">Número de edicto</p>
                <p className="text-sm font-medium">{draft.numeroEdicto}</p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{draft.nombreMartillero}</p>
                <p className="text-sm text-muted-foreground">
                  Matrícula: {draft.martilleroACargo}
                </p>
                {draft.cuitMartillero && (
                  <p className="text-sm text-muted-foreground">
                    CUIT: {displayCuit(draft.cuitMartillero)}
                  </p>
                )}
                {draft.telefonoMartillero && (
                  <p className="text-sm text-muted-foreground">
                    Teléfono: {displayTelefono(draft.telefonoMartillero)}
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
              <p className="font-medium">{draft.domicilio || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
