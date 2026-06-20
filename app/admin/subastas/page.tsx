"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getSubastasPrivadas,
  eliminarSubasta,
  type SubastaResponse,
} from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function formatFecha(s: string) {
  try {
    return new Date(s + "T12:00:00").toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return s
  }
}

export default function AdminSubastasPage() {
  const [subastas, setSubastas] = useState<SubastaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getSubastasPrivadas()
      .then(setSubastas)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await eliminarSubasta(id)
      load()
      setConfirmDelete(null)
    } catch {
      // error ya manejado en api
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Subastas / Edictos</h1>
        <Button asChild>
          <Link href="/admin/subastas/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Publicación externa
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : subastas.length === 0 ? (
        <p className="text-muted-foreground py-8">No hay subastas.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Título</th>
                <th className="text-left p-4 font-semibold">Origen</th>
                <th className="text-left p-4 font-semibold">Fechas</th>
                <th className="text-left p-4 font-semibold">Precio inicial</th>
                <th className="text-right p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subastas.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <Link
                      href={`/edictos/${s.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {s.titulo}
                    </Link>
                  </td>
                  <td className="p-4">
                    {s.esPublicacionExterna ? (
                      <Badge variant="secondary">Externa</Badge>
                    ) : (
                      <Badge variant="outline">Matriculado</Badge>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">
                    {formatFecha(s.fechaInicio)} – {formatFecha(s.fechaFin)}
                  </td>
                  <td className="p-4">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format(s.precioInicial)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {s.esPublicacionExterna ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/subastas/${s.id}/editar`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          title="Solo se editan publicaciones externas"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setConfirmDelete(s.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={confirmDelete !== null} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar subasta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmDelete !== null && handleDelete(confirmDelete)}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
