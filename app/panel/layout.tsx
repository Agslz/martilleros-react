import { PrivateGuard } from "@/components/auth/private-guard"
import { PanelLayout } from "@/components/layout/panel-layout"

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
