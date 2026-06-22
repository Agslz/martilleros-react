import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-muted/50 border border-border p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
              ¿Necesita verificar un martillero o consultar información?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Estamos para ayudarte. Podés buscar en nuestro registro público o 
              contactarnos directamente para cualquier consulta.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/buscar">
                  Buscar Martillero
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contacto">
                  <Phone className="mr-2 h-5 w-5" />
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
