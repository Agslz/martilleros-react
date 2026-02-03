"use client"

import { Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SubastasFilter() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium">Filtrar por:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select defaultValue="todas">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="inmuebles">Inmuebles</SelectItem>
              <SelectItem value="vehiculos">Vehículos</SelectItem>
              <SelectItem value="muebles">Muebles</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="proximas">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proximas">Próximas</SelectItem>
              <SelectItem value="realizadas">Realizadas</SelectItem>
              <SelectItem value="todas">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
