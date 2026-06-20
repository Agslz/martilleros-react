import { Header } from "./header"
import { Footer } from "./footer"
import { getContenido } from "@/lib/api"

interface PublicLayoutProps {
  children: React.ReactNode
}

export async function PublicLayout({ children }: PublicLayoutProps) {
  const contenidoContacto = await getContenido("CONTACTO")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer contenidoContacto={contenidoContacto} />
    </div>
  )
}
