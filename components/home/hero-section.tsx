"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Search,
  Users,
  Gavel,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { HomeBloque } from "@/lib/contenidos"

const HERO_SLIDES = [
  {
    src: "/images/primera-comision-martilleros.png",
    alt: "Integrantes de la comisión directiva del Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    caption: "Comisión Directiva 2024-2026",
    imageClass:
      "object-cover object-center sm:object-[50%_38%] md:object-[50%_40%]",
  },
  {
    src: "/images/festejo-dia-martillero-2025.png",
    alt: "Cena Día del Martillero — Colegio de Martilleros de Mendoza",
    caption: "Cena Día del Martillero",
    imageClass: "object-cover object-center",
  },
] as const

const SLIDE_INTERVAL_MS = 5000
const SLIDE_TRANSITION_MS = 700
const INITIAL_FADE_MS = 1000

const MARQUEE_MESSAGE =
  "Martilleros socios y no socios pueden publicar aquí su edicto. — Teléfono: 2617570100 — Correo: colegiomartilleros.1916@gmail.com"

const MARQUEE_COPIES = 6

type HeroSectionProps = {
  intro: HomeBloque
}

export function HeroSection({ intro }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [slideTransitionEnabled, setSlideTransitionEnabled] = useState(false)

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  }, [])

  const enableSlideTransition = useCallback(() => {
    setSlideTransitionEnabled(true)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setSlideTransitionEnabled(true)
      return
    }

    const id = window.setTimeout(
      () => setSlideTransitionEnabled(true),
      INITIAL_FADE_MS
    )
    return () => window.clearTimeout(id)
  }, [reduceMotion])

  const goToSlide = useCallback(
    (index: number) => {
      enableSlideTransition()
      setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length)
    },
    [enableSlideTransition]
  )

  const goNext = useCallback(() => {
    enableSlideTransition()
    setActiveIndex((i) => (i + 1) % HERO_SLIDES.length)
  }, [enableSlideTransition])

  const goPrev = useCallback(() => {
    enableSlideTransition()
    setActiveIndex(
      (i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    )
  }, [enableSlideTransition])

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      enableSlideTransition()
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, enableSlideTransition])

  return (
    <section className="relative overflow-hidden bg-stone-100">
      <p className="sr-only">{MARQUEE_MESSAGE}</p>
      <div
        className="w-full border-y border-[#6b291f] bg-[#7c3126] py-3.5 sm:py-4"
        aria-hidden
      >
        <div className="relative overflow-hidden" dir="ltr">
          <div className="hero-marquee-track flex w-max flex-nowrap">
            {Array.from({ length: MARQUEE_COPIES }, (_, slot) => (
              <span
                key={slot}
                className="inline-flex shrink-0 items-center gap-10 whitespace-nowrap px-10 text-xl font-semibold tracking-wide text-white sm:text-2xl lg:text-3xl sm:gap-12 sm:px-14"
              >
                <span>{MARQUEE_MESSAGE}</span>
                <span className="text-white/75 select-none" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div
          className={cn(
            "relative w-full overflow-hidden bg-stone-900",
            "min-h-[min(48vh,480px)] h-[min(48vh,480px)] sm:min-h-[min(65vh,720px)] sm:h-[min(65vh,720px)] lg:min-h-[min(70vh,880px)] lg:h-[min(70vh,880px)]",
            !slideTransitionEnabled && !reduceMotion && "hero-initial-fade",
          )}
          role="region"
          aria-roledescription="carousel"
          aria-label="Imágenes institucionales"
        >
          <div
            className={cn(
              "flex h-full will-change-transform",
              slideTransitionEnabled &&
                !reduceMotion &&
                "transition-transform ease-in-out",
            )}
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transitionDuration:
                slideTransitionEnabled && !reduceMotion
                  ? `${SLIDE_TRANSITION_MS}ms`
                  : undefined,
            }}
          >
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className="relative h-full min-w-full shrink-0"
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={slide.imageClass}
                />
              </div>
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45%] bg-gradient-to-t from-black/80 via-black/45 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 z-30 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 lg:px-8">
            <p className="max-w-4xl font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl text-pretty">
              {HERO_SLIDES[activeIndex].caption}
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-6">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75",
                )}
                aria-label={`Ir a imagen ${index + 1} de ${HERO_SLIDES.length}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-30 size-9 -translate-y-1/2 border-white/30 bg-black/40 text-white shadow-md hover:bg-black/55 sm:left-6 md:left-8"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-30 size-9 -translate-y-1/2 border-white/30 bg-black/40 text-white shadow-md hover:bg-black/55 sm:right-6 md:right-8"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-16 pt-4 sm:pt-6">
        <h1 className="max-w-4xl font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight text-balance">
          {intro.titulo}
        </h1>

        <p className="mt-5 max-w-3xl text-base sm:text-lg text-stone-600 leading-relaxed">
          {intro.cuerpo}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-institutional-navy text-white hover:bg-institutional-navy/90"
            asChild
          >
            <Link href="/buscar">
              <Search className="mr-2 h-5 w-5" />
              Buscar Martillero Habilitado
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
            asChild
          >
            <Link href="/edictos">
              Ver edictos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/buscar"
            className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-300 hover:shadow transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-institutional-navy">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Buscar Martillero</h2>
              <p className="text-sm text-stone-500">Verificá habilitación</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-stone-300 group-hover:text-stone-600 transition-colors" />
          </Link>

          <Link
            href="/matriculados"
            className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-300 hover:shadow transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-institutional-navy">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Matriculados</h2>
              <p className="text-sm text-stone-500">Listado completo</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-stone-300 group-hover:text-stone-600 transition-colors" />
          </Link>

          <Link
            href="/edictos"
            className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-300 hover:shadow transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-institutional-navy">
              <Gavel className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Edictos</h2>
              <p className="text-sm text-stone-500">Edictos publicados</p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-stone-300 group-hover:text-stone-600 transition-colors" />
          </Link>
        </div>
      </div>
    </section>
  )
}
