"use client"

import { useEffect, useState } from "react"
import { BookOpen, Loader2, ExternalLink, FileText, Download } from "lucide-react"
import { getDocumentosBiblioteca } from "@/lib/api"
import type { DocumentoBibliotecaResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

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
        <div className="space-y-6">
          {list.map((doc) => (
            <div
              key={doc.id}
              className="rounded-xl border border-border overflow-hidden bg-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-border">
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground truncate">
                    {doc.titulo}
                  </h2>
                  {doc.descripcion ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {doc.descripcion}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFecha(doc.createdAt)}
                    {doc.fileName ? ` · ${doc.fileName}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver PDF
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName || "documento.pdf"}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </a>
                  </Button>
                </div>
              </div>
              {doc.fileUrl ? (
                <iframe
                  src={doc.fileUrl}
                  title={doc.titulo}
                  className="w-full h-[28rem] bg-white"
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
