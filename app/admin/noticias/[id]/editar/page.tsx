"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getNoticiaAdminById,
  actualizarNoticia,
  publicarNoticia,
  subirImagenNoticia,
  eliminarImagenNoticia,
  type NoticiaResponse,
} from "@/lib/api"
import { archivosADataUrls } from "@/lib/edicto-preview"
import { guardarBorradorNoticiaVistaPrevia } from "@/lib/noticia-preview"
import { useToast } from "@/hooks/use-toast"

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export default function EditarNoticiaPage() {
  const params = useParams()
  const id = Number(params.id)
  const router = useRouter()
  const { toast } = useToast()
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noticia, setNoticia] = useState<NoticiaResponse | null>(null)
  const [titulo, setTitulo] = useState("")
  const [subtitulo, setSubtitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const load = () => {
    if (!Number.isFinite(id)) {
      setLoadingData(false)
      return
    }
    getNoticiaAdminById(id)
      .then((n) => {
        if (!n) {
          setError("Noticia no encontrada")
          return
        }
        setNoticia(n)
        setTitulo(n.titulo)
        setSubtitulo(n.subtitulo)
        setDescripcion(n.descripcion)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingData(false))
  }

  useEffect(() => {
    load()
  }, [id])

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
    const nuevas = files.length ? await archivosADataUrls(files) : []
    const existentes = (noticia?.imagenes ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((i) => i.fileUrl)
    guardarBorradorNoticiaVistaPrevia({
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim(),
      descripcion: descripcion.trim(),
      imagenUrls: [...existentes, ...nuevas],
    })
    window.open("/noticias/vista-previa", "_blank", "noopener,noreferrer")
  }

  const handleGuardar = async (publicar: boolean) => {
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      await actualizarNoticia(id, {
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        descripcion: descripcion.trim(),
      })
      const ordenBase = noticia?.imagenes?.length ?? 0
      for (let i = 0; i < files.length; i++) {
        await subirImagenNoticia(id, files[i], ordenBase + i)
      }
      if (publicar) {
        await publicarNoticia(id)
        toast({ title: "Noticia publicada" })
      } else {
        toast({ title: "Cambios guardados" })
      }
      setFiles([])
      router.push("/admin/noticias")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? (err instanceof Error ? err.message : "Error al guardar"))
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarImagen = async (imagenId: number) => {
    try {
      await eliminarImagenNoticia(id, imagenId)
      toast({ title: "Imagen eliminada" })
      setLoadingData(true)
      load()
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo eliminar",
        variant: "destructive",
      })
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!noticia) {
    return (
      <div>
        <p className="text-muted-foreground">{error ?? "Noticia no encontrada"}</p>
        <Button variant="link" asChild>
          <Link href="/admin/noticias">Volver</Link>
        </Button>
      </div>
    )
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
      <h1 className="text-2xl font-bold text-foreground mb-2">Editar noticia</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Estado: {noticia.publicado ? "Publicada" : "Borrador"}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitulo">Subtítulo</Label>
          <Input
            id="subtitulo"
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            rows={8}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {(noticia.imagenes?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <Label>Imágenes actuales</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {noticia.imagenes
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((img) => (
                  <div key={img.id} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.fileUrl}
                      alt={img.fileName}
                      className="aspect-video w-full object-cover rounded border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 opacity-90"
                      onClick={() => handleEliminarImagen(img.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nuevas">Agregar imágenes</Label>
          <Input
            id="nuevas"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []).filter((f) =>
                ALLOWED.includes(f.type)
              )
              setFiles(selected)
            }}
          />
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
            onClick={() => handleGuardar(false)}
          >
            Guardar
          </Button>
          <Button type="button" disabled={loading} onClick={() => handleGuardar(true)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar y publicar
          </Button>
        </div>
      </div>
    </div>
  )
}
