"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"

export type NoticiaMediaItem = {
  url: string
  alt?: string
  contentType?: string | null
  fileName?: string
}

function isPdf(item: NoticiaMediaItem) {
  const ct = (item.contentType ?? "").toLowerCase()
  if (ct.includes("pdf")) return true
  const name = (item.fileName ?? item.url ?? "").toLowerCase()
  return name.includes(".pdf")
}

function isImage(item: NoticiaMediaItem) {
  const ct = (item.contentType ?? "").toLowerCase()
  if (ct.startsWith("image/")) return true
  if (isPdf(item)) return false
  // compat adjuntos viejos sin contentType
  return true
}

type NoticiaMediaViewerProps = {
  items: NoticiaMediaItem[]
}

/** Imágenes: sin flechas si hay 1; carrusel si hay 2+. PDFs: visor embebido + descarga. */
export function NoticiaMediaViewer({ items }: NoticiaMediaViewerProps) {
  const images = items.filter(isImage)
  const pdfs = items.filter(isPdf)

  if (!items.length) return null

  return (
    <div className="space-y-6">
      {images.length > 0 && <ImageBlock images={images} />}
      {pdfs.map((pdf, i) => (
        <PdfBlock key={`${pdf.url}-${i}`} pdf={pdf} />
      ))}
    </div>
  )
}

function ImageBlock({ images }: { images: NoticiaMediaItem[] }) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const list = images.map((img) => ({
    url: img.url,
    alt: img.alt ?? img.fileName ?? "Imagen",
  }))
  const current = list[index] ?? list[0]
  const multi = list.length > 1

  const go = (delta: number) => {
    setIndex((i) => (i + delta + list.length) % list.length)
  }

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
        <button
          type="button"
          className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt}
            className="mx-auto max-h-[28rem] w-full object-contain bg-muted"
          />
        </button>
        {multi && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <ImageLightbox
        images={list}
        index={index}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setIndex}
      />
    </>
  )
}

function PdfBlock({ pdf }: { pdf: NoticiaMediaItem }) {
  const title = pdf.fileName || pdf.alt || "Documento PDF"
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-medium truncate">{title}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <a href={pdf.url} target="_blank" rel="noopener noreferrer">
              Abrir
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href={pdf.url} download={pdf.fileName || "documento.pdf"}>
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </a>
          </Button>
        </div>
      </div>
      <iframe
        src={pdf.url}
        title={title}
        className="w-full h-[32rem] bg-white"
      />
    </div>
  )
}
