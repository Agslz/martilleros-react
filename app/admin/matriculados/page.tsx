"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getMatriculadosAdmin,
  updateMatriculadoHabilitado,
  type MatriculadoPublicResponse,
} from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function excluirAdmin(list: MatriculadoPublicResponse[]) {
  return list.filter((m) => !m.matricula.toUpperCase().startsWith("ADMIN"))
}

export default function AdminMatriculadosPage() {
  const [list, setList] = useState<MatriculadoPublicResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [backendNoDisponible, setBackendNoDisponible] = useState(false)
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    setBackendNoDisponible(false)
    getMatriculadosAdmin()
      .then((data) => {
        setList(excluirAdmin(data))
      })
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message?.includes("404")) {
          setBackendNoDisponible(true)
          setList([])
        } else {
          toast({
            title: "Error",
            description: err.message ?? "No se pudo cargar el listado de matriculados.",
            variant: "destructive",
          })
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggleHabilitado = async (m: MatriculadoPublicResponse) => {
    const nuevoEstado = !m.habilitado
    setUpdatingId(m.id)
    try {
      await updateMatriculadoHabilitado(m.id, nuevoEstado)
      toast({
        title: nuevoEstado ? "Matriculado habilitado" : "Matriculado deshabilitado",
        description: `${m.apellido}, ${m.nombre} (${m.matricula}).`,
      })
      load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo actualizar el estado."
      const es404 = err && typeof err === "object" && "status" in err && err.status === 404
      toast({
        title: "Error",
        description: es404
          ? "El backend aún no expone PUT /api/admin/matriculados/{id}. Ver BACKEND_HABILITAR_MATRICULADO.txt."
          : msg,
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const habilitadoParaEjercer = (m: MatriculadoPublicResponse) =>
    m.habilitado && m.estadoFianza === "ACTIVA"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Matriculados</h1>
        <Button asChild>
          <Link href="/admin/matriculados/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo matriculado
          </Link>
        </Button>
      </div>

      {backendNoDisponible && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            El backend aún no expone <strong>GET /api/admin/matriculados</strong>. Para probar
            habilitar/deshabilitar podés usar la base de datos o ver{" "}
            <strong>BACKEND_HABILITAR_MATRICULADO.txt</strong>.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 && !backendNoDisponible ? (
        <p className="text-muted-foreground py-8">No hay matriculados en el listado.</p>
      ) : list.length === 0 ? null : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Matrícula</TableHead>
                <TableHead className="font-semibold">Apellido</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold text-center">Estado</TableHead>
                <TableHead className="font-semibold text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{m.matricula}</TableCell>
                  <TableCell>{m.apellido}</TableCell>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell className="text-center">
                    {habilitadoParaEjercer(m) ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-300 px-3 py-1 text-xs font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Habilitado
                      </span>
                    ) : !m.habilitado ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 px-3 py-1 text-xs font-medium">
                        <XCircle className="h-3 w-3" />
                        No habilitado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 px-3 py-1 text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        Fianza: {m.estadoFianza}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updatingId === m.id}
                      onClick={() => handleToggleHabilitado(m)}
                    >
                      {updatingId === m.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : m.habilitado ? (
                        "Deshabilitar"
                      ) : (
                        "Habilitar"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {list.length > 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          Mostrando {list.length} matriculados (se excluye al administrador).
        </p>
      )}
    </div>
  )
}
