import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Acceso matriculados",
  description:
    "Ingrese al área privada para matriculados del Colegio de Martilleros de Mendoza.",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <PublicLayout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </section>
    </PublicLayout>
  )
}
