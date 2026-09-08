import Link from "next/link"
import type { NoticiaResponse } from "@/lib/api"

type NoticiaCardProps = {
  noticia: NoticiaResponse
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

export function NoticiaCard({ noticia }: NoticiaCardProps) {
  const fecha = formatFechaPublicacion(noticia.fechaPublicacion)

  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
        {noticia.imagenPortadaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.imagenPortadaUrl}
            alt={noticia.titulo}
            className="h-full w-full object-contain transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {fecha && (
          <time
            dateTime={noticia.fechaPublicacion ?? undefined}
            className="text-xs font-medium text-muted-foreground"
          >
            {fecha}
          </time>
        )}
        <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary">
          {noticia.titulo}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {noticia.subtitulo}
        </p>
      </div>
    </Link>
  )
}
