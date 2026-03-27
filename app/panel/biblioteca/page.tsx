"use client"

import { useEffect, useState } from "react"
import { BookOpen, Loader2, ExternalLink, FileText } from "lucide-react"
import { getDocumentosBiblioteca } from "@/lib/api"
import type { DocumentoBibliotecaResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

function formatFecha(s: string) {
  try {
    return new Date(s).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return s
  }
}

export default function PanelBibliotecaPage() {
  const { toast } = useToast()
  const [list, setList] = useState<DocumentoBibliotecaResponse[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getDocumentosBiblioteca()
      .then(setList)
      .catch(() => {
        toast({
          title: "Error",
          description: "No se pudo cargar la biblioteca. Intente de nuevo.",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-primary" />
        Biblioteca
      </h1>
      <p className="text-muted-foreground mb-8">
        Documentos y normativa a disposición de los matriculados.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay documentos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Documento</th>
                <th className="text-left p-4 font-semibold hidden sm:table-cell">Descripción</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">Fecha</th>
                <th className="text-right p-4 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {list.map((doc) => (
                <tr key={doc.id} className="border-t border-border">
                  <td className="p-4 font-medium">{doc.titulo}</td>
                  <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell max-w-xs truncate">
                    {doc.descripcion || "—"}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">
                    {formatFecha(doc.createdAt)}
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                    >
                      Ver PDF
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
