import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NoticiaCard } from "@/components/noticias/noticia-card"
import type { NoticiaResponse } from "@/lib/api"

type NoticiasHomeSectionProps = {
  noticias: NoticiaResponse[]
}

export function NoticiasHomeSection({ noticias }: NoticiasHomeSectionProps) {
  if (!noticias.length) return null

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Últimas noticias
            </h2>
            <p className="mt-2 text-muted-foreground">
              Novedades del Colegio de Martilleros
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/noticias">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>
    </section>
  )
}
