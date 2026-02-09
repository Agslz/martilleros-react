"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getToken } from "@/lib/api"
import type { UserInfoResponse } from "@/lib/api"

interface PrivateGuardProps {
  children: React.ReactNode
}

export function PrivateGuard({ children }: PrivateGuardProps) {
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
        if (!u) {
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
