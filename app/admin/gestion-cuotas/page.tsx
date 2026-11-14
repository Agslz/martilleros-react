"use client"

import { useCallback, useEffect, useState } from "react"
import { Download, Loader2, Search, QrCode } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getMatriculadosAdmin,
  updateMatriculadoEstadoSocio,
  type MatriculadoPublicResponse,
} from "@/lib/api"
import type { EstadoSocio } from "@/lib/api/types"
import {
  ESTADOS_SOCIO,
  estadoSocioSeguro,
  etiquetaEstadoSocio,
} from "@/lib/estado-socio"
import { descargarQrMatriculado } from "@/lib/qr-matriculado"
import { useToast } from "@/components/ui/use-toast"

function excluirAdmin(list: MatriculadoPublicResponse[]) {
  return list.filter((m) => !m.matricula.toUpperCase().startsWith("ADMIN"))
}

export default function AdminGestionCuotasPage() {
  const [list, setList] = useState<MatriculadoPublicResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [apellidoInput, setApellidoInput] = useState("")
  const [apellidoFiltro, setApellidoFiltro] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const { toast } = useToast()

  const load = useCallback(
    (apellido: string) => {
      setLoading(true)
      getMatriculadosAdmin(apellido.trim() ? { apellido: apellido.trim() } : {})
        .then((data) => setList(excluirAdmin(data)))
        .catch((err: Error) => {
          toast({
            title: "Error",
            description: err.message ?? "No se pudo cargar el listado.",
            variant: "destructive",
          })
        })
        .finally(() => setLoading(false))
    },
    [toast]
  )

  useEffect(() => {
    load(apellidoFiltro)
  }, [apellidoFiltro, load])

  const handleBuscar = () => setApellidoFiltro(apellidoInput.trim())

  const handleEstadoChange = async (id: number, estadoSocio: EstadoSocio) => {
    setUpdatingId(id)
    try {
      const updated = await updateMatriculadoEstadoSocio(id, estadoSocio)
      setList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
      )
      toast({
        title: "Estado actualizado",
        description: etiquetaEstadoSocio(estadoSocio),
      })
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "No se pudo actualizar el estado de cuota.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDescargarQr = async (m: MatriculadoPublicResponse) => {
    setDownloadingId(m.id)
    try {
      await descargarQrMatriculado({
        id: m.id,
        matricula: m.matricula,
        apellido: m.apellido,
      })
      toast({
        title: "QR descargado",
        description: `PNG de ${m.apellido}, ${m.nombre}`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "No se pudo generar el QR.",
        variant: "destructive",
      })
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-7 w-7 text-primary" />
          Gestión de cuotas
        </h1>
        <p className="text-muted-foreground mt-1">
          Asigná el estado de cuota de cada socio y descargá su QR. Al
          escanearlo se muestra nombre, matrícula y estado.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Filtrar por apellido…"
            value={apellidoInput}
            onChange={(e) => setApellidoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBuscar()
            }}
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleBuscar}>
          Buscar
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando matriculados…
          </div>
        ) : list.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No hay matriculados para mostrar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="min-w-[200px]">Estado de cuota</TableHead>
                <TableHead className="text-right">QR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((m) => {
                const estado = estadoSocioSeguro(m.estadoSocio)
                const busy = updatingId === m.id
                const dl = downloadingId === m.id
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.matricula}</TableCell>
                    <TableCell>{m.apellido}</TableCell>
                    <TableCell>{m.nombre}</TableCell>
                    <TableCell>
                      <Select
                        value={estado}
                        disabled={busy}
                        onValueChange={(v) =>
                          void handleEstadoChange(m.id, v as EstadoSocio)
                        }
                      >
                        <SelectTrigger className="w-[200px]">
                          {busy ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Guardando…
                            </span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS_SOCIO.map((e) => (
                            <SelectItem key={e} value={e}>
                              {etiquetaEstadoSocio(e)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={dl}
                        onClick={() => void handleDescargarQr(m)}
                      >
                        {dl ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="ml-2">Descargar QR</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Mostrando {list.length} matriculado{list.length === 1 ? "" : "s"}
      </p>
    </div>
  )
}
