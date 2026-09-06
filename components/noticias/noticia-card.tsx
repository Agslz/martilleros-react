import Link from "next/link"
import type { NoticiaResponse } from "@/lib/api"

type NoticiaCardProps = {
  noticia: NoticiaResponse
}

export function NoticiaCard({ noticia }: NoticiaCardProps) {
  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {noticia.imagenPortadaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.imagenPortadaUrl}
            alt={noticia.titulo}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
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
