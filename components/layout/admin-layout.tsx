"use client"

import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { removeToken } from "@/lib/api"

const adminNav = [
  { name: "Panel", href: "/admin", icon: LayoutDashboard },
  { name: "Subastas", href: "/admin/subastas", icon: Gavel },
  { name: "Biblioteca", href: "/admin/biblioteca", icon: BookOpen },
  { name: "Verificación de fianzas", href: "/admin/verificacion-fianzas", icon: ShieldCheck },
  { name: "Matriculados", href: "/admin/matriculados", icon: Users },
  { name: "Nuevo matriculado", href: "/admin/matriculados/nuevo", icon: Users },
  { name: "Contenidos", href: "/admin/contenidos", icon: FileText },
  { name: "Cuotas", href: "/admin/cuotas", icon: CreditCard },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
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
          {adminNav.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/")
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
