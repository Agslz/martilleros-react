"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Gavel, Eye, EyeOff, LogIn } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    matricula: "",
    password: "",
    remember: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login - this is a mockup
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-institutional-navy px-6 py-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-4">
          <Gavel className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">
          Acceso Matriculados
        </h1>
        <p className="mt-2 text-white/70">
          Ingrese a su área privada
        </p>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="matricula">Número de Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Ej: M-0001"
              required
              value={formData.matricula}
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                required
                className="pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, remember: checked as boolean })
                }
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Recordarme
              </Label>
            </div>
            <Link
              href="#"
              className="text-sm text-primary hover:underline"
            >
              Olvidé mi contraseña
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="mr-2 h-5 w-5" />
            Ingresar
          </Button>
        </form>

        {/* Help text */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            ¿Problemas para ingresar?{" "}
            <Link href="/contacto" className="text-primary hover:underline">
              Contáctenos
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
