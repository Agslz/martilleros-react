import type { Metadata } from "next"
import { PrivateGuard } from "@/components/auth/private-guard"
import { PanelLayout } from "@/components/layout/panel-layout"

export const metadata: Metadata = {
  title: "Panel de matriculado",
  robots: { index: false, follow: false },
}

export default function PanelRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateGuard>
      <PanelLayout>{children}</PanelLayout>
    </PrivateGuard>
  )
}
