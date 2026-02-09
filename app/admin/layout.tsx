import { AdminGuard } from "@/components/auth/admin-guard"
import { AdminLayout } from "@/components/layout/admin-layout"

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
