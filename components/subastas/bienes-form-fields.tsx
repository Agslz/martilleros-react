"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BienSubastaRequest } from "@/lib/api"

type BienesFormFieldsProps = {
  cantidad: number
  onCantidadChange: (n: number) => void
  bienes: BienSubastaRequest[]
  onBienesChange: (bienes: BienSubastaRequest[]) => void
}

export function BienesFormFields({
  cantidad,
  onCantidadChange,
  bienes,
  onBienesChange,
}: BienesFormFieldsProps) {
  const setCantidad = (raw: number) => {
    const n = Math.max(1, Math.min(20, Math.floor(raw) || 1))
    onCantidadChange(n)
    const next = [...bienes]
    while (next.length < n) {
      next.push({ titulo: n === 1 ? "Bien" : "", precioBase: 0 })
    }
    while (next.length > n) next.pop()
    if (n === 1 && next[0]) {
      next[0] = { ...next[0], titulo: next[0].titulo || "Bien" }
    }
    onBienesChange(next)
  }

  const updateBien = (index: number, patch: Partial<BienSubastaRequest>) => {
    const next = bienes.map((b, i) => (i === index ? { ...b, ...patch } : b))
    onBienesChange(next)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="cantidadBienes">Cantidad de bienes</Label>
        <Input
          id="cantidadBienes"
          type="number"
          min={1}
          max={20}
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value) || 1)}
        />
        <p className="text-xs text-muted-foreground">
          Si es más de uno, cada bien necesita título y base.
        </p>
      </div>

      {bienes.map((b, i) => (
        <div
          key={i}
          className="rounded-lg border border-border p-4 space-y-3 bg-muted/20"
        >
          {cantidad > 1 && (
            <div className="space-y-2">
              <Label htmlFor={`bien-titulo-${i}`}>Título del bien {i + 1}</Label>
              <Input
                id={`bien-titulo-${i}`}
                value={b.titulo}
                placeholder={`Ej. Inmueble ${i + 1}`}
                onChange={(e) => updateBien(i, { titulo: e.target.value })}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`bien-base-${i}`}>
              {cantidad > 1 ? `Base — bien ${i + 1}` : "Base"}
            </Label>
            <Input
              id={`bien-base-${i}`}
              type="number"
              min={1}
              required
              value={b.precioBase || ""}
              onChange={(e) =>
                updateBien(i, { precioBase: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      ))}

      {cantidad > 1 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCantidad(cantidad + 1)}
        >
          Agregar bien
        </Button>
      )}
    </div>
  )
}

export function validateBienes(bienes: BienSubastaRequest[]): string | null {
  if (!bienes.length) return "Indicá al menos un bien."
  for (let i = 0; i < bienes.length; i++) {
    const b = bienes[i]
    if (!b.precioBase || b.precioBase <= 0) {
      return `La base del bien ${i + 1} debe ser mayor a 0.`
    }
    if (bienes.length > 1 && !b.titulo.trim()) {
      return `El título del bien ${i + 1} es obligatorio.`
    }
  }
  return null
}
