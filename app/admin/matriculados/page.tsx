"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Loader2, CheckCircle2, XCircle, AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getMatriculadosAdmin,
  updateMatriculadoHabilitado,
  type AdminMatriculadosFiltros,
  type MatriculadoPublicResponse,
} from "@/lib/api"
import {
  etiquetaEstadoFianza,
  matriculaPuedeEjercer,
} from "@/lib/estado-fianza"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FiltroHabilitado = "todos" | "habilitados" | "deshabilitados"

function excluirAdmin(list: MatriculadoPublicResponse[]) {
  return list.filter((m) => !m.matricula.toUpperCase().startsWith("ADMIN"))
}

function filtrosDesdeUi(
  apellido: string,
  habilitado: FiltroHabilitado
): AdminMatriculadosFiltros {
  const out: AdminMatriculadosFiltros = {}
  const a = apellido.trim()
  if (a) out.apellido = a
  if (habilitado === "habilitados") out.habilitado = true
  if (habilitado === "deshabilitados") out.habilitado = false
  return out
}

export default function AdminMatriculadosPage() {
  const [list, setList] = useState<MatriculadoPublicResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [backendNoDisponible, setBackendNoDisponible] = useState(false)
  const [apellidoInput, setApellidoInput] = useState("")
  const [apellidoFiltro, setApellidoFiltro] = useState("")
  const [filtroHabilitado, setFiltroHabilitado] =
    useState<FiltroHabilitado>("todos")
  const { toast } = useToast()

  const load = useCallback(
    (apellido: string, habilitado: FiltroHabilitado) => {
      setLoading(true)
      setBackendNoDisponible(false)
      getMatriculadosAdmin(filtrosDesdeUi(apellido, habilitado))
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
              description:
                err.message ?? "No se pudo cargar el listado de matriculados.",
              variant: "destructive",
            })
          }
        })
        .finally(() => setLoading(false))
    },
    [toast]
  )

  useEffect(() => {
    load(apellidoFiltro, filtroHabilitado)
  }, [apellidoFiltro, filtroHabilitado, load])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    setApellidoFiltro(apellidoInput.trim())
  }

  const handleLimpiar = () => {
    setApellidoInput("")
    setApellidoFiltro("")
    setFiltroHabilitado("todos")
  }

  const handleToggleHabilitado = async (m: MatriculadoPublicResponse) => {
    const nuevoEstado = !m.habilitado
    setUpdatingId(m.id)
    try {
      await updateMatriculadoHabilitado(m.id, nuevoEstado)
      toast({
        title: nuevoEstado ? "Matriculado habilitado" : "Matriculado deshabilitado",
        description: `${m.apellido}, ${m.nombre} (${m.matricula}).`,
      })
      load(apellidoFiltro, filtroHabilitado)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo actualizar el estado."
      const es404 = err && typeof err === "object" && "status" in err && err.status === 404
      toast({
        title: "Error",
        description: es404
          ? "El backend aún no expone PUT /api/admin/matriculados/{id}."
          : msg,
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const habilitadoParaEjercer = matriculaPuedeEjercer
  const hayFiltrosActivos =
    apellidoFiltro.length > 0 || filtroHabilitado !== "todos"

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Matriculados</h1>
        <Button asChild>
          <Link href="/admin/matriculados/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo matriculado
          </Link>
        </Button>
      </div>

      <form
        onSubmit={handleBuscar}
        className="bg-card rounded-xl border border-border p-4 sm:p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por apellido..."
              className="pl-10"
              value={apellidoInput}
              onChange={(e) => setApellidoInput(e.target.value)}
            />
          </div>
          <Select
            value={filtroHabilitado}
            onValueChange={(v) => setFiltroHabilitado(v as FiltroHabilitado)}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Habilitación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="habilitados">Habilitados</SelectItem>
              <SelectItem value="deshabilitados">Deshabilitados</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
            {hayFiltrosActivos && (
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleLimpiar}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </form>

      {backendNoDisponible && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            El backend aún no expone <strong>GET /api/admin/matriculados</strong>. Para probar
            habilitar/deshabilitar. Ver documentación en cm-backend.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 && !backendNoDisponible ? (
        <p className="text-muted-foreground py-8">
          {hayFiltrosActivos
            ? "No hay matriculados que coincidan con los filtros."
            : "No hay matriculados en el listado."}
        </p>
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
                        Fianza: {etiquetaEstadoFianza(m.estadoFianza)}
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
          Mostrando {list.length} matriculados
          {hayFiltrosActivos ? " (filtros aplicados)" : ""}; se excluye al administrador.
        </p>
      )}
    </div>
  )
}
