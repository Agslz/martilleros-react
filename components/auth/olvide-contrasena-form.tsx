"use client"

import { useState } from "react"
import Link from "next/link"
import { Gavel, Mail, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { olvideContrasena } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function OlvideContrasenaForm() {
  const { toast } = useToast()
  const [matricula, setMatricula] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!matricula.trim()) return
    setLoading(true)
    try {
      const res = await olvideContrasena(matricula.trim())
      if (res.success) {
        setSent(true)
        toast({
          title: "Listo",
          description: "Se envió una contraseña temporal a su email. Revise su bandeja.",
        })
      } else {
        const msg = res.message ?? "No encontramos esa matrícula."
        const isRateLimit =
          msg.toLowerCase().includes("intento") ||
          msg.toLowerCase().includes("minuto")
        toast({
          title: "Error",
          description: isRateLimit
            ? "Demasiados intentos. Espere unos minutos."
            : msg,
          variant: "destructive",
        })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error de conexión. Intente más tarde."
      const isNetwork = msg.includes("fetch") || msg.includes("red") || msg.includes("CORS")
      toast({
        title: "Error",
        description: isNetwork ? "Error de conexión. Intente más tarde." : msg,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
        <div className="bg-institutional-navy px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">
            Revisá tu email
          </h1>
          <p className="mt-2 text-white/70">
            Enviamos una contraseña temporal a su correo registrado.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm text-muted-foreground mb-6">
            Si no aparece en la bandeja principal, revisá la carpeta de spam.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      <div className="bg-institutional-navy px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
          <Gavel className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Olvidé mi contraseña
        </h1>
        <p className="mt-2 text-white/70">
          Ingresá tu matrícula y te enviaremos una contraseña temporal por email.
        </p>
      </div>
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="matricula">Número de Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Ej: M-0001"
              required
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Mail className="mr-2 h-5 w-5" />
            )}
            {loading ? "Enviando..." : "Enviar contraseña temporal"}
          </Button>
        </form>
        <p className="mt-6 pt-6 border-t border-border text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
