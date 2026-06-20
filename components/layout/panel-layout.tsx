"use client"

import Link from "next/link"
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
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { endClientSession } from "@/lib/auth-session"

const panelNav = [
  { name: "Mi estado", href: "/panel", icon: User },
  { name: "Subastas", href: "/panel/subastas", icon: Gavel },
  { name: "Fianzas", href: "/panel/fianzas", icon: Shield },
  { name: "Cuotas", href: "/panel/cuotas", icon: CreditCard },
  { name: "Biblioteca", href: "/panel/biblioteca", icon: BookOpen },
  { name: "Mi perfil", href: "/panel/perfil", icon: User },
]

export function PanelLayout({ children }: { children: React.ReactNode }) {
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
    <div className="h-screen flex overflow-hidden">
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <button
            type="button"
            onClick={() => void handleBackToSite()}
            className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {panelNav.map((item) => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== "/panel" && pathname.startsWith(item.href + "/"))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 pl-64 h-screen overflow-auto bg-background">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
