"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getToken } from "@/lib/api"
import type { UserInfoResponse } from "@/lib/api"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/login")
      return
    }
    getCurrentUser()
      .then((u) => {
        if (!u || u.role !== "ADMIN") {
          router.replace("/login")
          return
        }
        setUser(u)
      })
      .catch(() => router.replace("/login"))
      .finally(() => setChecking(false))
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Verificando acceso...</p>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
