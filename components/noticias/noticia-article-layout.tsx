import { NoticiaCarousel } from "@/components/noticias/noticia-carousel"

type NoticiaArticleLayoutProps = {
  titulo: string
  subtitulo: string
  descripcion: string
  imagenes: { url: string; alt?: string }[]
  /** Contenido extra arriba del layout (ej. badge vista previa) */
  topSlot?: React.ReactNode
  /** Contenido extra abajo */
  bottomSlot?: React.ReactNode
}

/**
 * Layout editorial: imagen a la izquierda, título + texto a la derecha (desktop).
 * En mobile se apila imagen → textos.
 */
export function NoticiaArticleLayout({
  titulo,
  subtitulo,
  descripcion,
  imagenes,
  topSlot,
  bottomSlot,
}: NoticiaArticleLayoutProps) {
  const tieneImagenes = imagenes.length > 0

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {topSlot}

      <div
        className={
          tieneImagenes
            ? "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start"
            : "max-w-3xl"
        }
      >
        {tieneImagenes && (
          <div className="order-1 min-w-0 lg:sticky lg:top-24">
            <NoticiaCarousel images={imagenes} />
          </div>
        )}

        <div
          className={`min-w-0 space-y-5 overflow-hidden ${tieneImagenes ? "order-2" : ""}`}
        >
          <header className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight break-words [overflow-wrap:anywhere]">
              {titulo}
            </h1>
            {subtitulo ? (
              <p className="text-lg text-muted-foreground break-words [overflow-wrap:anywhere]">
                {subtitulo}
              </p>
            ) : null}
          </header>
          <div className="prose prose-neutral dark:prose-invert max-w-none min-w-0">
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-foreground leading-relaxed">
              {descripcion}
            </p>
          </div>
        </div>
      </div>

      {bottomSlot}
    </article>
  )
}
