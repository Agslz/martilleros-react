"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CrearMatriculadoResponse } from "@/lib/api"

interface CredencialesMatriculadoDialogProps {
  open: boolean
  data: CrearMatriculadoResponse
  onConfirm: () => void
}

function formatCredenciales(data: CrearMatriculadoResponse): string {
  return `Matrícula: ${data.matricula}\nContraseña temporal: ${data.contrasenaTemporal}`
}

export function CredencialesMatriculadoDialog({
  open,
  data,
  onConfirm,
}: CredencialesMatriculadoDialogProps) {
  const [copiedField, setCopiedField] = useState<"all" | "password" | null>(null)

  const copyText = async (text: string, field: "all" | "password") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      setCopiedField(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Matriculado creado</DialogTitle>
          <DialogDescription>
            Entregue estas credenciales al matriculado. También se envió un email si
            tiene dirección cargada. Esta contraseña no se volverá a mostrar.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Matrícula</p>
            <p className="font-mono font-semibold text-foreground">{data.matricula}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Contraseña temporal</p>
            <p className="font-mono font-semibold text-foreground break-all">
              {data.contrasenaTemporal}
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            El matriculado inicia sesión con la matrícula y esta contraseña. Si es su
            primer acceso, deberá completar el perfil y cambiar la contraseña.
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => void copyText(formatCredenciales(data), "all")}
            >
              {copiedField === "all" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copiedField === "all" ? "Copiado" : "Copiar credenciales"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => void copyText(data.contrasenaTemporal, "password")}
            >
              {copiedField === "password" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copiedField === "password" ? "Copiado" : "Copiar solo contraseña"}
            </Button>
          </div>
          <Button type="button" className="w-full" onClick={onConfirm}>
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
