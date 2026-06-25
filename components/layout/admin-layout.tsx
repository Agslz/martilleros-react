"use client"

import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Gavel,
  BookOpen,
  Users,
  FileText,
  CreditCard,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminInactivityMonitor } from "@/components/auth/admin-inactivity-monitor"
import { endClientSession } from "@/lib/auth-session"
import {
  DashboardMobileBottomNav,
  DashboardMobileTopBar,
  DashboardSidebarNav,
  type DashboardNavItem,
} from "@/components/layout/dashboard-nav"

const adminNav: DashboardNavItem[] = [
  { name: "Panel", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Edictos", href: "/admin/subastas", icon: Gavel },
  { name: "Biblioteca", href: "/admin/biblioteca", icon: BookOpen },
  {
    name: "Verificación de credenciales",
    shortName: "Credenciales",
    href: "/admin/verificacion-fianzas",
    icon: ShieldCheck,
  },
  {
    name: "Matriculados",
    href: "/admin/matriculados",
    icon: Users,
    exact: true,
  },
  {
    name: "Nuevo matriculado",
    shortName: "Nuevo",
    href: "/admin/matriculados/nuevo",
    icon: UserPlus,
  },
  { name: "Contenidos", href: "/admin/contenidos", icon: FileText },
  { name: "Cuotas", href: "/admin/cuotas", icon: CreditCard },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await endClientSession()
    window.location.href = "/login"
  }

  const handleBackToSite = async () => {
    await endClientSession()
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminInactivityMonitor />

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border p-4">
          <button
            type="button"
            onClick={() => void handleBackToSite()}
            className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </button>
        </div>
        <DashboardSidebarNav items={adminNav} pathname={pathname} />
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => void handleLogout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardMobileTopBar
          onBackToSite={() => void handleBackToSite()}
          onLogout={() => void handleLogout()}
        />

        <main className="min-w-0 flex-1 overflow-auto bg-background pb-24 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        <DashboardMobileBottomNav items={adminNav} pathname={pathname} />
      </div>
    </div>
  )
}
