"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"

type GalleryImage = {
  id?: string | number
  url: string
  alt?: string
}

interface SubastaGalleryProps {
  imagenes: GalleryImage[]
  titulo: string
}

export function SubastaGallery({ imagenes, titulo }: SubastaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (imagenes.length === 0) return null

  const images = imagenes.map((img, i) => ({
    url: img.url || "/placeholder.svg",
    alt: img.alt || `${titulo} — imagen ${i + 1}`,
  }))

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group">
        <button
          type="button"
          className="absolute inset-0 cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt}
            className="h-full w-full object-contain"
          />
        </button>

        {imagenes.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background z-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Imagen anterior</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background z-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background z-10"
          onClick={() => setLightboxOpen(true)}
        >
          <ZoomIn className="h-5 w-5" />
          <span className="sr-only">Ver imagen ampliada</span>
        </Button>

        <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-full text-sm font-medium z-10 pointer-events-none">
          {selectedIndex + 1} / {imagenes.length}
        </div>
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((imagen, index) => (
            <button
              key={imagenes[index].id ?? index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-muted ${
                index === selectedIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagen.url}
                alt={imagen.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        images={images}
        index={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setSelectedIndex}
      />
    </div>
  )
}
