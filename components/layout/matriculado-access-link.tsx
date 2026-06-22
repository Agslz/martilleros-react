"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getToken } from "@/lib/api"
import { getPrivateAreaPath } from "@/lib/remember-login"

type MatriculadoAccessLinkProps = {
  className?: string
  variant?: "default" | "outline"
  fullWidth?: boolean
}

export function MatriculadoAccessLink({
  className,
  variant = "outline",
  fullWidth = false,
}: MatriculadoAccessLinkProps) {
  const [href, setHref] = useState("/login")
  const [label, setLabel] = useState("Acceso Matriculados")

  useEffect(() => {
    const token = getToken()
    if (!token) return

    getCurrentUser()
      .then((user) => {
        if (!user) return
        setHref(getPrivateAreaPath(user.role, user.primeraVezLogin))
        setLabel(
          user.role === "ADMIN" ? "Panel administración" : "Mi panel"
        )
      })
      .catch(() => {
        /* sin sesión válida → login */
      })
  }, [])

  return (
    <Button
      variant={variant}
      className={fullWidth ? `w-full ${className ?? ""}` : className}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}
