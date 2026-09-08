"use client"

import { useEffect, useState } from "react"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type ImageLightboxProps = {
  images: { url: string; alt?: string }[]
  index: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onIndexChange?: (index: number) => void
}

export function ImageLightbox({
  images,
  index,
  open,
  onOpenChange,
  onIndexChange,
}: ImageLightboxProps) {
  if (!images.length) return null
  const safeIndex = ((index % images.length) + images.length) % images.length
  const current = images[safeIndex]

  const go = (delta: number) => {
    const next = (safeIndex + delta + images.length) % images.length
    onIndexChange?.(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-5xl p-0 bg-black/95 border-none overflow-hidden"
      >
        <DialogTitle className="sr-only">
          {current.alt ?? "Imagen ampliada"}
        </DialogTitle>
        <div className="relative flex min-h-[50vh] max-h-[90vh] items-center justify-center p-4 sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt ?? `Imagen ${safeIndex + 1}`}
            className="max-h-[85vh] max-w-full w-auto object-contain"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </Button>
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => go(-1)}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => go(1)}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              <p className="absolute bottom-3 left-0 right-0 text-center text-white/80 text-sm">
                {safeIndex + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

type ZoomableImageProps = {
  src: string
  alt?: string
  className?: string
  images?: { url: string; alt?: string }[]
  startIndex?: number
}

/** Imagen clickeable que abre lightbox. */
export function ZoomableImage({
  src,
  alt,
  className,
  images,
  startIndex = 0,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(startIndex)
  const list = images?.length ? images : [{ url: src, alt }]

  useEffect(() => {
    setIndex(startIndex)
  }, [startIndex])

  return (
    <>
      <button
        type="button"
        className="relative group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => {
          setIndex(startIndex)
          setOpen(true)
        }}
        aria-label="Ampliar imagen"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} className={className} />
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-background/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
      <ImageLightbox
        images={list}
        index={index}
        open={open}
        onOpenChange={setOpen}
        onIndexChange={setIndex}
      />
    </>
  )
}
