"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type NoticiaCarouselProps = {
  images: { url: string; alt?: string }[]
}

export function NoticiaCarousel({ images }: NoticiaCarouselProps) {
  const [index, setIndex] = useState(0)
  if (!images.length) return null

  const go = (delta: number) => {
    setIndex((i) => (i + delta + images.length) % images.length)
  }

  const current = images[index]

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.alt ?? `Imagen ${index + 1}`}
        className="aspect-[16/10] w-full object-cover"
      />
      {images.length > 1 && (
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
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir a imagen ${i + 1}`}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
