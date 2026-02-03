import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for demonstration
const matriculados = [
  { id: 1, matricula: "M-0001", nombre: "Juan Carlos", apellido: "González", estado: "habilitado" },
  { id: 2, matricula: "M-0002", nombre: "María Elena", apellido: "Rodríguez", estado: "habilitado" },
  { id: 3, matricula: "M-0003", nombre: "Carlos Alberto", apellido: "Fernández", estado: "habilitado" },
  { id: 4, matricula: "M-0004", nombre: "Ana María", apellido: "López", estado: "suspendido" },
  { id: 5, matricula: "M-0005", nombre: "Roberto", apellido: "Martínez", estado: "habilitado" },
  { id: 6, matricula: "M-0006", nombre: "Laura", apellido: "García", estado: "habilitado" },
  { id: 7, matricula: "M-0007", nombre: "Diego", apellido: "Pérez", estado: "habilitado" },
  { id: 8, matricula: "M-0008", nombre: "Silvia", apellido: "Sánchez", estado: "habilitado" },
  { id: 9, matricula: "M-0009", nombre: "Martín", apellido: "Díaz", estado: "suspendido" },
  { id: 10, matricula: "M-0010", nombre: "Patricia", apellido: "Torres", estado: "habilitado" },
]

export function MatriculadosList() {
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
              <TableCell className="font-medium">{matriculado.apellido}</TableCell>
              <TableCell>{matriculado.nombre}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={matriculado.estado === "habilitado" ? "default" : "destructive"}
                  className={
                    matriculado.estado === "habilitado"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {matriculado.estado === "habilitado" ? "Habilitado" : "Suspendido"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination info */}
      <div className="px-6 py-4 border-t border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Mostrando 10 de 500+ matriculados
        </p>
      </div>
    </div>
  )
}
