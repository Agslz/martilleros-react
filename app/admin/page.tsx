import Link from "next/link"
import { Gavel, BookOpen, Users, FileText, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const links = [
  { href: "/admin/subastas", name: "Subastas", icon: Gavel },
  { href: "/admin/biblioteca", name: "Biblioteca", icon: BookOpen },
  { href: "/admin/matriculados/nuevo", name: "Nuevo matriculado", icon: Users },
  { href: "/admin/contenidos", name: "Contenidos", icon: FileText },
  { href: "/admin/cuotas", name: "Cuotas", icon: CreditCard },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Panel de administración</h1>
      <p className="text-muted-foreground mb-8">
        Gestión de subastas, biblioteca, matriculados, contenidos y cuotas.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ir a {item.name.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
