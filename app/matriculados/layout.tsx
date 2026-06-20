import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PublicLayout } from "@/components/layout/public-layout"

export const metadata: Metadata = {
  title: "Matriculados",
  description:
    "Listado público de martilleros y corredores matriculados en el Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza.",
  alternates: { canonical: "/matriculados" },
}

export default function MatriculadosLayout({
  children,
}: {
  children: ReactNode
}) {
  return <PublicLayout>{children}</PublicLayout>
}
