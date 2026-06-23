"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type DashboardNavItem = {
  name: string
  href: string
  icon: LucideIcon
  exact?: boolean
  /** Etiqueta más corta para la barra inferior en móvil. */
  shortName?: string
}

export function isDashboardNavActive(
  pathname: string,
  item: DashboardNavItem
): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(item.href + "/")
}

type DashboardSidebarNavProps = {
  items: DashboardNavItem[]
  pathname: string
}

export function DashboardSidebarNav({
  items,
  pathname,
}: DashboardSidebarNavProps) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {items.map((item) => {
        const Icon = item.icon
        const active = isDashboardNavActive(pathname, item)
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
            <Icon className="h-5 w-5 shrink-0" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

type DashboardMobileBottomNavProps = {
  items: DashboardNavItem[]
  pathname: string
}

export function DashboardMobileBottomNav({
  items,
  pathname,
}: DashboardMobileBottomNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    const active = activeRef.current
    if (!container || !active) return

    const targetScrollLeft =
      active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth",
    })
  }, [pathname])

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-card/90 lg:hidden"
      aria-label="Navegación del panel"
    >
      <div
        ref={scrollRef}
        className={cn(
          "overflow-x-auto overscroll-x-contain",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-max min-w-full justify-center gap-1 px-2 py-2",
            "pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          )}
        >
          {items.map((item) => {
            const Icon = item.icon
            const active = isDashboardNavActive(pathname, item)
            const label = item.shortName ?? item.name

            return (
              <Link
                key={item.href}
                ref={(el) => {
                  if (active) activeRef.current = el
                }}
                href={item.href}
                className={cn(
                  "flex w-[4.75rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="w-full text-center text-[10px] font-medium leading-tight line-clamp-2">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

type DashboardMobileTopBarProps = {
  onBackToSite: () => void
  onLogout: () => void
  backLabel?: string
  /** Si es true, volver al sitio no cierra sesión (panel matriculado). */
  backOnly?: boolean
}

export function DashboardMobileTopBar({
  onBackToSite,
  onLogout,
  backLabel = "Volver al sitio",
  backOnly = false,
}: DashboardMobileTopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={onBackToSite}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {backLabel}
      </button>
      {!backOnly && (
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-medium text-primary hover:underline"
        >
          Salir
        </button>
      )}
      {backOnly && (
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-medium text-primary hover:underline"
        >
          Cerrar sesión
        </button>
      )}
    </header>
  )
}
