import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vista previa del edicto",
  robots: { index: false, follow: false },
}

export default function VistaPreviaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
