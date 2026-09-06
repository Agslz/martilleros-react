"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  crearNoticia,
  actualizarNoticia,
  publicarNoticia,
  subirImagenNoticia,
} from "@/lib/api"
import { archivosADataUrls } from "@/lib/edicto-preview"
import { guardarBorradorNoticiaVistaPrevia } from "@/lib/noticia-preview"
import { useToast } from "@/hooks/use-toast"

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export default function NuevaNoticiaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [titulo, setTitulo] = useState("")
  const [subtitulo, setSubtitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    if (!files.length) {
      setPreviews([])
      return
    }
    let cancelled = false
    archivosADataUrls(files).then((urls) => {
      if (!cancelled) setPreviews(urls)
    })
    return () => {
      cancelled = true
    }
  }, [files])

  const validate = () => {
    if (!titulo.trim() || !subtitulo.trim() || !descripcion.trim()) {
      setError("Completá título, subtítulo y descripción.")
      return false
    }
    return true
  }

  const handleVistaPrevia = async () => {
    setError(null)
    if (!validate()) return
    const imagenUrls = files.length ? await archivosADataUrls(files) : []
    guardarBorradorNoticiaVistaPrevia({
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim(),
      descripcion: descripcion.trim(),
      imagenUrls,
    })
    window.open("/noticias/vista-previa", "_blank", "noopener,noreferrer")
  }

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const creada = await crearNoticia({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        descripcion: descripcion.trim(),
      })
      if (!creada) throw new Error("No se pudo crear la noticia")
      for (let i = 0; i < files.length; i++) {
        await subirImagenNoticia(creada.id, files[i], i)
      }
      await publicarNoticia(creada.id)
      toast({ title: "Noticia publicada" })
      router.push("/admin/noticias")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? (err instanceof Error ? err.message : "Error al publicar"))
    } finally {
      setLoading(false)
    }
  }

  const handleGuardarBorrador = async () => {
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const creada = await crearNoticia({
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        descripcion: descripcion.trim(),
      })
      if (!creada) throw new Error("No se pudo crear")
      for (let i = 0; i < files.length; i++) {
        await subirImagenNoticia(creada.id, files[i], i)
      }
      toast({ title: "Borrador guardado" })
      router.push(`/admin/noticias/${creada.id}/editar`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/noticias"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a noticias
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nueva noticia</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handlePublicar} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitulo">Subtítulo</Label>
          <Input
            id="subtitulo"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            rows={8}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="imagenes">Imágenes</Label>
          <Input
            id="imagenes"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? [])
              const valid = selected.filter((f) => ALLOWED.includes(f.type))
              if (valid.length !== selected.length) {
                toast({
                  title: "Algunos archivos no son imágenes válidas",
                  variant: "destructive",
                })
              }
              setFiles(valid)
            }}
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  className="aspect-video object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleVistaPrevia}>
            <Eye className="h-4 w-4 mr-2" />
            Vista previa
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleGuardarBorrador}
          >
            Guardar borrador
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Publicar
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/noticias">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
