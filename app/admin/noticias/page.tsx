"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getNoticiasAdmin,
  eliminarNoticia,
  publicarNoticia,
  despublicarNoticia,
  type NoticiaResponse,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
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

export default function AdminNoticiasPage() {
  const { toast } = useToast()
  const [list, setList] = useState<NoticiaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getNoticiasAdmin()
      .then(setList)
      .catch((err: Error) => {
        toast({
          title: "Error",
          description: err.message ?? "No se pudo cargar noticias.",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleTogglePublicado = async (n: NoticiaResponse) => {
    setBusyId(n.id)
    try {
      if (n.publicado) {
        await despublicarNoticia(n.id)
        toast({ title: "Noticia despublicada" })
      } else {
        await publicarNoticia(n.id)
        toast({ title: "Noticia publicada" })
      }
      load()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo actualizar.",
        variant: "destructive",
      })
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (id: number) => {
    setBusyId(id)
    try {
      await eliminarNoticia(id)
      toast({ title: "Noticia eliminada" })
      setConfirmDelete(null)
      load()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo eliminar.",
        variant: "destructive",
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Noticias</h1>
        <Button asChild>
          <Link href="/admin/noticias/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva noticia
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground py-8">No hay noticias.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Título</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">
                  Estado
                </th>
                <th className="text-right p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id} className="border-t border-border">
                  <td className="p-4">
                    <p className="font-medium">{n.titulo}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {n.subtitulo}
                    </p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {n.publicado ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Publicada
                      </Badge>
                    ) : (
                      <Badge variant="outline">Borrador</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/noticias/${n.id}/editar`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === n.id}
                        onClick={() => handleTogglePublicado(n)}
                      >
                        {busyId === n.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : n.publicado ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publicar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setConfirmDelete(n.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la noticia y sus imágenes. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                confirmDelete !== null && handleDelete(confirmDelete)
              }
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
