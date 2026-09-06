import type { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import NoticiaVistaPreviaContent from "./vista-previa-content"

export const metadata: Metadata = {
  title: "Vista previa de noticia",
  robots: { index: false, follow: false },
}

export default function NoticiaVistaPreviaPage() {
  return (
    <PublicLayout>
      <NoticiaVistaPreviaContent />
    </PublicLayout>
  )
}
