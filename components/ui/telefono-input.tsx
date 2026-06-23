"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mergeTelefono, splitTelefono, stripTelefono } from "@/lib/telefono"

type TelefonoInputProps = {
  idPrefix?: string
  codigoArea: string
  numero: string
  onChange: (codigoArea: string, numero: string) => void
  disabled?: boolean
  required?: boolean
  label?: string
  showHint?: boolean
}

export function TelefonoInput({
  idPrefix = "tel",
  codigoArea,
  numero,
  onChange,
  disabled = false,
  required = false,
  label = "Teléfono celular",
  showHint = true,
}: TelefonoInputProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? "" : " (opcional)"}
      </Label>
      <div className="flex gap-3">
        <div className="w-24 shrink-0 space-y-1">
          <Label htmlFor={`${idPrefix}-area`} className="text-xs text-muted-foreground">
            Cód. área
          </Label>
          <Input
            id={`${idPrefix}-area`}
            inputMode="numeric"
            placeholder="261"
            maxLength={4}
            disabled={disabled}
            value={codigoArea}
            onChange={(e) =>
              onChange(stripTelefono(e.target.value).slice(0, 4), numero)
            }
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Label htmlFor={`${idPrefix}-num`} className="text-xs text-muted-foreground">
            Número
          </Label>
          <Input
            id={`${idPrefix}-num`}
            inputMode="numeric"
            placeholder="5120574"
            maxLength={8}
            disabled={disabled}
            value={numero}
            onChange={(e) =>
              onChange(codigoArea, stripTelefono(e.target.value).slice(0, 8))
            }
          />
        </div>
      </div>
      {showHint && (
        <p className="text-xs text-muted-foreground">
          Sin el 15. Ejemplo: 261 + 5120574
        </p>
      )}
    </div>
  )
}

export function telefonoFromParts(codigoArea: string, numero: string): string {
  return mergeTelefono(codigoArea, numero)
}

export function telefonoToParts(telefono: string | null | undefined) {
  return splitTelefono(telefono)
}
