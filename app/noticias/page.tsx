import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { NoticiaCard } from "@/components/noticias/noticia-card"
import { getNoticiasPublicas } from "@/lib/api"

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias e informaciones del Colegio de Martilleros de Mendoza.",
}

export default async function NoticiasPage() {
  const noticias = await getNoticiasPublicas()

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-3">
          Noticias
        </h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Información y novedades del Colegio de Martilleros Públicos y Corredores
          de Comercio de Mendoza.
        </p>

        {noticias.length === 0 ? (
          <p className="text-muted-foreground py-12">
            Todavía no hay noticias publicadas.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n) => (
              <NoticiaCard key={n.id} noticia={n} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
