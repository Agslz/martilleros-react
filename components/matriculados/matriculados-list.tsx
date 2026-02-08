"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MatriculadoPublicResponse } from "@/lib/api"

interface MatriculadosListProps {
  matriculados: MatriculadoPublicResponse[]
  loading: boolean
  totalCount: number
}

export function MatriculadosList({
  matriculados,
  loading,
  totalCount,
}: MatriculadosListProps) {
  const habilitadoParaEjercer = (m: MatriculadoPublicResponse) =>
    m.habilitado && m.estadoFianza === "ACTIVA"

  if (loading && matriculados.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
        Cargando listado de matriculados...
      </div>
    )
  }

  if (matriculados.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
        No hay matriculados que coincidan con el criterio de búsqueda.
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Matrícula</TableHead>
            <TableHead className="font-semibold">Apellido</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matriculados.map((matriculado) => (
            <TableRow key={matriculado.id} className="hover:bg-muted/30">
              <TableCell className="font-medium text-primary">
                {matriculado.matricula}
              </TableCell>
              <TableCell className="font-medium">
                {matriculado.apellido}
              </TableCell>
              <TableCell>{matriculado.nombre}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    habilitadoParaEjercer(matriculado) ? "default" : "secondary"
                  }
                  className={
                    habilitadoParaEjercer(matriculado)
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  }
                >
                  {habilitadoParaEjercer(matriculado)
                    ? "Habilitado"
                    : matriculado.estadoFianza}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Mostrando {matriculados.length}
          {totalCount > matriculados.length
            ? ` de ${totalCount} matriculados`
            : " matriculados"}
        </p>
      </div>
    </div>
  )
}
