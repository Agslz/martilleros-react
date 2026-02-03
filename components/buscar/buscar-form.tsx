"use client"

import React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function BuscarForm() {
  const [apellido, setApellido] = useState("")
  const [matricula, setMatricula] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search - this is a mockup
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 sm:p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              type="text"
              placeholder="Ingrese el apellido..."
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">N° de Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Ej: M-0001"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            Buscar Martillero
          </Button>
        </div>
      </div>
      
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Puede buscar por apellido, número de matrícula o ambos criterios.
      </p>
    </form>
  )
}
