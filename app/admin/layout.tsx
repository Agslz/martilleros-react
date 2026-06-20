import type { Metadata } from "next"
import { AdminGuard } from "@/components/auth/admin-guard"
import { AdminLayout } from "@/components/layout/admin-layout"

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  )
}
