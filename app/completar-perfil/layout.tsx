import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PublicLayout } from "@/components/layout/public-layout"

export const metadata: Metadata = {
  title: "Completar perfil",
  description: "Complete su email y contraseña para continuar.",
  robots: { index: false, follow: false },
}

export default function CompletarPerfilLayout({
  children,
}: {
  children: ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
