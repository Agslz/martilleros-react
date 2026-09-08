"use client"

import { useEffect, useState } from "react"
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

function emptyBien(multi: boolean): BienSubastaRequest {
  return {
    titulo: multi ? "" : "Bien",
    precioBase: 0,
    incremento: multi ? 0 : undefined,
  }
}

export function BienesFormFields({
  cantidad,
  onCantidadChange,
  bienes,
  onBienesChange,
}: BienesFormFieldsProps) {
  const [cantidadRaw, setCantidadRaw] = useState(String(cantidad || 1))

  useEffect(() => {
    setCantidadRaw(String(cantidad || 1))
  }, [cantidad])

  const applyCantidad = (n: number) => {
    const clamped = Math.max(1, Math.min(20, n))
    onCantidadChange(clamped)
    const multi = clamped > 1
    const next = [...bienes]
    while (next.length < clamped) next.push(emptyBien(multi))
    while (next.length > clamped) next.pop()
    if (!multi && next[0]) {
      next[0] = {
        ...next[0],
        titulo: next[0].titulo || "Bien",
        incremento: undefined,
      }
    } else if (multi) {
      for (let i = 0; i < next.length; i++) {
        next[i] = {
          ...next[i],
          incremento: next[i].incremento ?? 0,
        }
      }
    }
    onBienesChange(next)
    setCantidadRaw(String(clamped))
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
          value={cantidadRaw}
          onChange={(e) => {
            const raw = e.target.value
            setCantidadRaw(raw)
            if (raw.trim() === "") return
            const n = Number(raw)
            if (Number.isFinite(n) && n >= 1) applyCantidad(n)
          }}
          onBlur={() => {
            if (cantidadRaw.trim() === "") {
              applyCantidad(1)
              return
            }
            const n = Number(cantidadRaw)
            applyCantidad(Number.isFinite(n) ? n : 1)
          }}
        />
        <p className="text-xs text-muted-foreground">
          Si hay 2 o más, cada bien necesita título, base e incremento.
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
          {cantidad > 1 && (
            <div className="space-y-2">
              <Label htmlFor={`bien-inc-${i}`}>Incremento — bien {i + 1}</Label>
              <Input
                id={`bien-inc-${i}`}
                type="number"
                min={1}
                required
                value={b.incremento || ""}
                onChange={(e) =>
                  updateBien(i, { incremento: Number(e.target.value) || 0 })
                }
              />
            </div>
          )}
        </div>
      ))}

      {cantidad > 1 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyCantidad(cantidad + 1)}
        >
          Agregar bien
        </Button>
      )}
    </div>
  )
}

export function validateBienes(bienes: BienSubastaRequest[]): string | null {
  if (!bienes.length) return "Indicá al menos un bien."
  const multi = bienes.length > 1
  for (let i = 0; i < bienes.length; i++) {
    const b = bienes[i]
    if (!b.precioBase || b.precioBase <= 0) {
      return `La base del bien ${i + 1} debe ser mayor a 0.`
    }
    if (multi && !b.titulo.trim()) {
      return `El título del bien ${i + 1} es obligatorio.`
    }
    if (multi && (!b.incremento || b.incremento <= 0)) {
      return `El incremento del bien ${i + 1} debe ser mayor a 0.`
    }
  }
  return null
}
