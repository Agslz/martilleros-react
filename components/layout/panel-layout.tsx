"use client"

import { usePathname } from "next/navigation"
import {
  User,
  Shield,
  CreditCard,
  LogOut,
  ArrowLeft,
  BookOpen,
  Gavel,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { endClientSession } from "@/lib/auth-session"
import {
  DashboardMobileBottomNav,
  DashboardMobileTopBar,
  DashboardSidebarNav,
  type DashboardNavItem,
} from "@/components/layout/dashboard-nav"

const panelNav: DashboardNavItem[] = [
  { name: "Mi estado", shortName: "Estado", href: "/panel", icon: User, exact: true },
  { name: "Subastas", href: "/panel/subastas", icon: Gavel },
  { name: "Credenciales", href: "/panel/credenciales", icon: Shield },
  { name: "Cuotas", href: "/panel/cuotas", icon: CreditCard },
  { name: "Biblioteca", href: "/panel/biblioteca", icon: BookOpen },
  { name: "Mi perfil", shortName: "Perfil", href: "/panel/perfil", icon: User },
]

export function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await endClientSession()
    window.location.href = "/login"
  }

  const handleBackToSite = () => {
    window.location.href = "/"
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border p-4">
          <button
            type="button"
            onClick={handleBackToSite}
            className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </button>
        </div>
        <DashboardSidebarNav items={panelNav} pathname={pathname} />
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-64">
        <DashboardMobileTopBar
          backOnly
          onBackToSite={handleBackToSite}
          onLogout={() => void handleLogout()}
        />

        <main className="min-h-0 flex-1 overflow-auto bg-background pb-24 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        <DashboardMobileBottomNav items={panelNav} pathname={pathname} />
      </div>
    </div>
  )
}
