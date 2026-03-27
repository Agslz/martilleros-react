import { PublicLayout } from "@/components/layout/public-layout"
import { OlvideContrasenaForm } from "@/components/auth/olvide-contrasena-form"

export const metadata = {
  title: "Olvidé mi contraseña | Colegio de Martilleros de Mendoza",
  description: "Solicite una contraseña temporal por email para acceder al área de matriculados.",
}

export default function OlvideContrasenaPage() {
  return (
    <PublicLayout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <OlvideContrasenaForm />
        </div>
      </section>
    </PublicLayout>
  )
}
