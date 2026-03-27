"use client"

import { useEffect, useState } from "react"
import { User, Shield, Wallet, Loader2 } from "lucide-react"
import { getEstadoMatriculado } from "@/lib/api"
import type { EstadoMatriculadoResponse } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function PanelPage() {
  const { toast } = useToast()
  const [estado, setEstado] = useState<EstadoMatriculadoResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEstadoMatriculado()
      .then(setEstado)
      .catch(() => {
        toast({
          title: "Error",
          description: "No se pudo cargar su estado. Intente más tarde.",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!estado) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Mi estado</h1>
        <p className="text-muted-foreground">No se pudo cargar el estado.</p>
      </div>
    )
  }

  // Regla de negocio: puede ejercer solo si está habilitado y tiene fianza ACTIVA
  const puedeEjercer = estado.habilitado && estado.estadoFianza === "ACTIVA"
  const fianzaActiva = estado.estadoFianza === "ACTIVA"

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Mi estado</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className={puedeEjercer ? "border-green-500/50" : "border-amber-500/50"}>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Habilitado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={estado.habilitado ? "default" : "secondary"}
              className={
                estado.habilitado
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
              }
            >
              {estado.habilitado ? "Sí" : "No"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Fianza</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className={
                fianzaActiva
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
              }
            >
              {estado.estadoFianza}
            </Badge>
            {estado.fechaVencimientoFianza && (
              <p className="text-xs text-muted-foreground mt-2">
                Vence: {new Date(estado.fechaVencimientoFianza).toLocaleDateString("es-AR")}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Puede ejercer</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={puedeEjercer ? "default" : "secondary"}
              className={
                puedeEjercer
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
              }
            >
              {puedeEjercer ? "Sí" : "No"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
