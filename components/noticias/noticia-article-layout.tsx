import type { ReactNode } from "react"
import { NoticiaMediaViewer, type NoticiaMediaItem } from "@/components/noticias/noticia-media-viewer"
import { youtubeEmbedUrl } from "@/lib/youtube"

type NoticiaArticleLayoutProps = {
  titulo: string
  subtitulo: string
  descripcion: string
  media: NoticiaMediaItem[]
  youtubeUrl?: string | null
  fechaPublicacion?: string | null
  topSlot?: ReactNode
  bottomSlot?: ReactNode
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
  youtubeUrl,
  fechaPublicacion,
  topSlot,
  bottomSlot,
}: NoticiaArticleLayoutProps) {
  const tieneMedia = media.length > 0
  const embed = youtubeEmbedUrl(youtubeUrl)
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

      {embed && (
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Video
          </h2>
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-black aspect-video">
            <iframe
              src={embed}
              title={`Video — ${titulo}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}

      {bottomSlot}
    </article>
  )
}
