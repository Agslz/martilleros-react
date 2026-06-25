import { PublicLayout } from "@/components/layout/public-layout"
import { VistaPreviaEdictoContent } from "./vista-previa-content"

export default function VistaPreviaEdictoPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <VistaPreviaEdictoContent />
      </div>
    </PublicLayout>
  )
}
