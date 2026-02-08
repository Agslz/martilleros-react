"use client"

import { Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SubastasFilterProps {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function SubastasFilter({
  value,
  onValueChange,
  disabled,
}: SubastasFilterProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium">Filtrar por estado:</span>
        </div>
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
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
  )
}
