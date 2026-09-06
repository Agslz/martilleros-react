import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PublicLayout } from "@/components/layout/public-layout"
import { NoticiaCarousel } from "@/components/noticias/noticia-carousel"
import { getNoticiaPublicaById, getNoticiasPublicas } from "@/lib/api"
import { getSiteUrl } from "@/lib/site"

interface NoticiaDetailProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: NoticiaDetailProps): Promise<Metadata> {
  const { id } = await params
  const noticia = await getNoticiaPublicaById(Number(id))
  if (!noticia) {
    return { title: "Noticia no encontrada", robots: { index: false, follow: false } }
  }
  const path = `/noticias/${id}`
  return {
    title: noticia.titulo,
    description: noticia.subtitulo,
    alternates: { canonical: path },
    openGraph: {
      title: noticia.titulo,
      description: noticia.subtitulo,
      url: `${getSiteUrl()}${path}`,
      type: "article",
    },
  }
}

export default async function NoticiaDetailPage({ params }: NoticiaDetailProps) {
  const { id } = await params
  const noticia = await getNoticiaPublicaById(Number(id))
  if (!noticia) notFound()

  const imagenes =
    noticia.imagenes?.map((img) => ({
      url: img.fileUrl,
      alt: img.fileName || noticia.titulo,
    })) ?? []

  return (
    <PublicLayout>
      <div className="bg-muted/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/noticias"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a noticias
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        <header className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
            {noticia.titulo}
          </h1>
          <p className="text-lg text-muted-foreground">{noticia.subtitulo}</p>
        </header>

        {imagenes.length > 0 && <NoticiaCarousel images={imagenes} />}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {noticia.descripcion}
          </p>
        </div>
      </article>
    </PublicLayout>
  )
}

export async function generateStaticParams() {
  try {
    const list = await getNoticiasPublicas()
    return list.map((n) => ({ id: String(n.id) }))
  } catch {
    return []
  }
}
