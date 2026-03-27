"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PublicLayout } from "@/components/layout/public-layout"
import { CompletarPerfilForm } from "@/components/auth/completar-perfil-form"
import { getToken } from "@/lib/api"

export default function CompletarPerfilPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <PublicLayout>
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <CompletarPerfilForm />
        </div>
      </section>
    </PublicLayout>
  )
}
