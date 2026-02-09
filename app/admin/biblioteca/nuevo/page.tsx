"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  subirPdfBiblioteca,
  crearDocumentoBiblioteca,
  type DocumentoBibliotecaRequest,
} from "@/lib/api"

export default function NuevoDocumentoBibliotecaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    visibleParaMatriculados: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Seleccioná un archivo PDF.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const upload = await subirPdfBiblioteca(file)
      if (!upload) {
        setError("No se pudo subir el archivo.")
        setLoading(false)
        return
      }
      const body: DocumentoBibliotecaRequest = {
        titulo: form.titulo || file.name,
        descripcion: form.descripcion || undefined,
        fileName: upload.fileName,
        fileUrl: upload.fileUrl,
        visibleParaMatriculados: form.visibleParaMatriculados,
      }
      const created = await crearDocumentoBiblioteca(body)
      if (created) {
        router.push("/admin/biblioteca")
        return
      }
      setError("No se pudo crear el documento.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : null
      setError(msg ?? "Error al crear el documento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/biblioteca"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a biblioteca
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nuevo documento</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file">Archivo PDF</Label>
          <div className="flex items-center gap-4">
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file && (
              <span className="text-sm text-muted-foreground">{file.name}</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Si está vacío se usa el nombre del archivo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción (opcional)</Label>
          <Textarea
            id="descripcion"
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="visible"
            checked={form.visibleParaMatriculados}
            onCheckedChange={(checked) =>
              setForm({ ...form, visibleParaMatriculados: checked })
            }
          />
          <Label htmlFor="visible">Visible para matriculados</Label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading || !file}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Subir y crear documento
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/biblioteca">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
