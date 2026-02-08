'use client'

import { PublicLayout } from "@/components/layout/public-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Acceso Matriculados | Colegio de Martilleros de Mendoza",
  description: "Ingrese al área privada para matriculados del Colegio de Martilleros de Mendoza.",
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
