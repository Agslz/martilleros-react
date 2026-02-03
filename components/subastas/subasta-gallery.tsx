"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { SubastaImagen } from "@/lib/data/subastas"

interface SubastaGalleryProps {
  imagenes: SubastaImagen[]
  titulo: string
}

export function SubastaGallery({ imagenes, titulo }: SubastaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
  }

  const openLightbox = () => {
    setIsLightboxOpen(true)
  }

  if (imagenes.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden group">
        <Image
          src={imagenes[selectedIndex].url || "/placeholder.svg"}
          alt={imagenes[selectedIndex].alt}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        {imagenes.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Imagen anterior</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          onClick={openLightbox}
        >
          <ZoomIn className="h-5 w-5" />
          <span className="sr-only">Ver imagen ampliada</span>
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/80 px-3 py-1 rounded-full text-sm font-medium">
          {selectedIndex + 1} / {imagenes.length}
        </div>
      </div>

      {/* Thumbnails */}
      {imagenes.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {imagenes.map((imagen, index) => (
            <button
              key={imagen.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={imagen.url || "/placeholder.svg"}
                alt={imagen.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <div className="relative aspect-video">
            <Image
              src={imagenes[selectedIndex].url || "/placeholder.svg"}
              alt={imagenes[selectedIndex].alt}
              fill
              className="object-contain"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar</span>
            </Button>

            {/* Navigation in Lightbox */}
            {imagenes.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Imagen anterior</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Imagen siguiente</span>
                </Button>
              </>
            )}

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-center">
                {imagenes[selectedIndex].alt}
              </p>
              <p className="text-white/60 text-sm text-center mt-1">
                {selectedIndex + 1} de {imagenes.length} - {titulo}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
