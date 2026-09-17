import { NoticiaMediaViewer, type NoticiaMediaItem } from "@/components/noticias/noticia-media-viewer"

type NoticiaArticleLayoutProps = {
  titulo: string
  subtitulo: string
  descripcion: string
  media: NoticiaMediaItem[]
  fechaPublicacion?: string | null
  topSlot?: React.ReactNode
  bottomSlot?: React.ReactNode
}

function formatFechaPublicacion(iso?: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Mendoza",
  }).format(d)
}

export function NoticiaArticleLayout({
  titulo,
  subtitulo,
  descripcion,
  media,
  fechaPublicacion,
  topSlot,
  bottomSlot,
}: NoticiaArticleLayoutProps) {
  const tieneMedia = media.length > 0
  const fecha = formatFechaPublicacion(fechaPublicacion)

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {topSlot}

      <div
        className={
          tieneMedia
            ? "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start"
            : "max-w-3xl"
        }
      >
        {tieneMedia && (
          <div className="order-1 min-w-0 lg:sticky lg:top-24">
            <NoticiaMediaViewer items={media} />
          </div>
        )}

        <div
          className={`min-w-0 space-y-5 overflow-hidden ${tieneMedia ? "order-2" : ""}`}
        >
          <header className="space-y-3">
            {fecha && (
              <time
                dateTime={fechaPublicacion ?? undefined}
                className="text-sm font-medium text-muted-foreground"
              >
                {fecha}
              </time>
            )}
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
