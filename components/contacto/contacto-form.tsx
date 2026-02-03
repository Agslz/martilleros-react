"use client"

import React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ContactoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - this is a mockup
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Envíenos un mensaje
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Su nombre"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="su@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="(0261) 123-4567"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto *</Label>
            <Select 
              value={formData.asunto} 
              onValueChange={(value) => setFormData({ ...formData, asunto: value })}
            >
              <SelectTrigger id="asunto">
                <SelectValue placeholder="Seleccione un asunto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">Consulta General</SelectItem>
                <SelectItem value="verificacion">Verificación de Martillero</SelectItem>
                <SelectItem value="denuncia">Denuncia</SelectItem>
                <SelectItem value="matriculacion">Matriculación</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensaje">Mensaje *</Label>
          <Textarea
            id="mensaje"
            placeholder="Escriba su mensaje aquí..."
            rows={5}
            required
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            * Campos obligatorios
          </p>
          <Button type="submit" size="lg">
            <Send className="mr-2 h-5 w-5" />
            Enviar Mensaje
          </Button>
        </div>
      </form>
    </div>
  )
}
