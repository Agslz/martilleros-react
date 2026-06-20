import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PublicLayout } from "@/components/layout/public-layout"

export const metadata: Metadata = {
  title: "Buscar martillero habilitado",
  description:
    "Verifique si un martillero o corredor está matriculado y habilitado en el Colegio de Martilleros de Mendoza.",
  alternates: { canonical: "/buscar" },
}

export default function BuscarLayout({
  children,
}: {
  children: ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
