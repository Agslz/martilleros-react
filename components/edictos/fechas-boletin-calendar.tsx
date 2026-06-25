"use client"

import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  esFinDeSemana,
  fechasDatesToIso,
  fechasIsoToDates,
} from "@/lib/fechas-boletin"

type FechasBoletinCalendarProps = {
  value: string[]
  onChange: (fechas: string[]) => void
  className?: string
}

export function FechasBoletinCalendar({
  value,
  onChange,
  className,
}: FechasBoletinCalendarProps) {
  const selected = fechasIsoToDates(value)

  return (
    <div className={cn("space-y-3", className)}>
      <Calendar
        mode="multiple"
        selected={selected}
        onSelect={(dates) => {
          onChange(fechasDatesToIso(dates ?? []))
        }}
        disabled={esFinDeSemana}
        className="rounded-lg border border-border p-3"
      />
      {value.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Días seleccionados:{" "}
          <span className="font-medium text-foreground">
            {value
              .map((f) =>
                new Date(f + "T12:00:00").toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              )
              .join(" · ")}
          </span>
        </p>
      )}
      <p className="text-sm font-medium text-foreground">
        Cantidad de publicaciones:{" "}
        <span className="text-primary">{value.length}</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Solo días hábiles (lunes a viernes). Los sábados y domingos no se pueden
        elegir.
      </p>
    </div>
  )
}

export function validarFechasBoletin(fechas: string[]): string | null {
  if (fechas.length === 0) {
    return "Seleccioná al menos una fecha de publicación en el Boletín Oficial."
  }
  for (const f of fechas) {
    if (esFinDeSemana(isoToDateSafe(f))) {
      return "Las fechas del boletín deben ser días hábiles (lunes a viernes)."
    }
  }
  return null
}

function isoToDateSafe(iso: string): Date {
  return new Date(iso + "T12:00:00")
}
