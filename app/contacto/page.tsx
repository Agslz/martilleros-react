import { PublicLayout } from "@/components/layout/public-layout"
import { ContactoHeader } from "@/components/contacto/contacto-header"
import { ContactoForm } from "@/components/contacto/contacto-form"
import { ContactoInfo } from "@/components/contacto/contacto-info"

export const metadata = {
  title: "Contacto | Colegio de Martilleros de Mendoza",
  description: "Póngase en contacto con el Colegio de Martilleros de Mendoza. Estamos aquí para ayudarle.",
}

export default function ContactoPage() {
  return (
    <PublicLayout>
      <ContactoHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactoForm />
            </div>
            <div>
              <ContactoInfo />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
