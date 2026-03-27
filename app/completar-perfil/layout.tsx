import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Completar perfil | Colegio de Martilleros de Mendoza",
  description: "Complete su email y contraseña para continuar.",
}

export default function CompletarPerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
