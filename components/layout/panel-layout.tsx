"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Shield, CreditCard, Wallet, LogOut, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { removeToken } from "@/lib/api"

const panelNav = [
  { name: "Mi estado", href: "/panel", icon: User },
  { name: "Fianzas", href: "/panel/fianzas", icon: Shield },
  { name: "Pagos", href: "/panel/pagos", icon: Wallet },
  { name: "Cuotas", href: "/panel/cuotas", icon: CreditCard },
]

export function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const handleLogout = () => {
    removeToken()
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {panelNav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
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
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
