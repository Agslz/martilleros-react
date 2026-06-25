"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Loader2,
  User,
  ImagePlus,
  FileText,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FechasBoletinCalendar,
  validarFechasBoletin,
} from "@/components/edictos/fechas-boletin-calendar"
import {
  getCurrentUser,
  getSubastasPrivadas,
  actualizarSubastaMatriculado,
  subirImagenSubastaMatriculado,
  eliminarImagenSubastaMatriculado,
  type ActualizarSubastaMatriculadoRequest,
  type SubastaResponse,
  type ImagenSubastaResponse,
} from "@/lib/api"
import { displayCuit } from "@/lib/cuit"
import { displayTelefono } from "@/lib/telefono"
import { getFechasBoletin } from "@/lib/subasta-display"
import { guardarBorradorVistaPrevia, archivosADataUrls } from "@/lib/edicto-preview"
import { useToast } from "@/hooks/use-toast"

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

function subastaToForm(s: SubastaResponse) {
  return {
    titulo: s.titulo,
    descripcion: s.descripcion,
    precioInicial: s.precioInicial,
    incrementos: s.incrementos ?? 0,
    domicilio: s.domicilio,
    edictoTexto: s.edictoTexto ?? "",
    numeroEdicto: s.numeroEdicto ?? "",
  }
}

export default function PanelEditarEdictoPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [deletingImagenId, setDeletingImagenId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [subasta, setSubasta] = useState<SubastaResponse | null>(null)
  const [imagenesExistentes, setImagenesExistentes] = useState<
    ImagenSubastaResponse[]
  >([])
  const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([])
  const [fechasBoletin, setFechasBoletin] = useState<string[]>([])
  const [perfilMartillero, setPerfilMartillero] = useState({
    matricula: "",
    nombre: "",
    cuit: "",
    telefono: "",
    cuitRaw: "",
    telefonoRaw: "",
  })
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precioInicial: 0,
    incrementos: 0,
    domicilio: "",
    edictoTexto: "",
    numeroEdicto: "",
  })

  useEffect(() => {
    Promise.all([getSubastasPrivadas(), getCurrentUser()]).then(
      ([list, user]) => {
        const s = list.find((x) => x.id === id) ?? null
        if (user) {
          setPerfilMartillero({
            matricula: user.matricula,
            nombre: [user.nombre, user.apellido].filter(Boolean).join(" "),
            cuit: user.cuit ? displayCuit(user.cuit) : "—",
            telefono: user.telefono ? displayTelefono(user.telefono) : "—",
            cuitRaw: user.cuit ?? "",
            telefonoRaw: user.telefono ?? "",
          })
        }
        if (
          s &&
          user &&
          s.martilleroACargo.toUpperCase() === user.matricula.toUpperCase() &&
          !s.esPublicacionExterna
        ) {
          setSubasta(s)
          setForm(subastaToForm(s))
          setFechasBoletin(getFechasBoletin(s))
          setImagenesExistentes(s.imagenes ?? [])
        }
        setLoadingData(false)
      }
    )
  }, [id])

  const validarFormulario = (): string | null => {
    if (!form.titulo.trim()) return "El título es obligatorio."
    if (!form.descripcion.trim()) return "La descripción es obligatoria."
    if (form.precioInicial <= 0) return "La base debe ser mayor a 0."
    if (!form.domicilio.trim()) return "El domicilio es obligatorio."
    if (!form.edictoTexto.trim()) {
      return "El texto completo del edicto es obligatorio."
    }
    return validarFechasBoletin(fechasBoletin)
  }

  const handleVistaPrevia = async () => {
    const validationError = validarFormulario()
    if (validationError) {
      setError(validationError)
      toast({
        title: "Complete el formulario",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    const urlsExistentes = imagenesExistentes.map((i) => i.fileUrl)
    const urlsNuevas = await archivosADataUrls(imagenesNuevas)
    guardarBorradorVistaPrevia({
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precioInicial: form.precioInicial,
      incrementos: form.incrementos > 0 ? form.incrementos : undefined,
      domicilio: form.domicilio.trim(),
      edictoTexto: form.edictoTexto.trim(),
      numeroEdicto: form.numeroEdicto.trim() || undefined,
      fechasPublicacionBoletin: fechasBoletin,
      nombreMartillero: perfilMartillero.nombre,
      martilleroACargo: perfilMartillero.matricula,
      cuitMartillero: perfilMartillero.cuitRaw || undefined,
      telefonoMartillero: perfilMartillero.telefonoRaw || undefined,
      imagenUrls: [...urlsExistentes, ...urlsNuevas],
    })
    window.open("/edictos/vista-previa", "_blank", "noopener,noreferrer")
  }

  const handleEliminarImagen = async (imagenId: number) => {
    if (!subasta) return
    setDeletingImagenId(imagenId)
    try {
      await eliminarImagenSubastaMatriculado(subasta.id, imagenId)
      setImagenesExistentes((prev) => prev.filter((i) => i.id !== imagenId))
      toast({ title: "Imagen eliminada" })
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar la imagen.",
        variant: "destructive",
      })
    } finally {
      setDeletingImagenId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const validationError = validarFormulario()
    if (validationError) {
      setError(validationError)
      toast({
        title: "Revise el formulario",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const body: ActualizarSubastaMatriculadoRequest = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        precioInicial: form.precioInicial,
        domicilio: form.domicilio.trim(),
        edictoTexto: form.edictoTexto.trim(),
        fechasPublicacionBoletin: fechasBoletin,
      }
      if (form.numeroEdicto.trim()) {
        body.numeroEdicto = form.numeroEdicto.trim()
      }
      if (form.incrementos > 0) {
        body.incrementos = form.incrementos
      }

      const updated = await actualizarSubastaMatriculado(id, body)
      if (!updated) {
        setError("No se pudo guardar el edicto.")
        setLoading(false)
        return
      }

      if (imagenesNuevas.length > 0) {
        const baseOrden = imagenesExistentes.length
        for (let i = 0; i < imagenesNuevas.length; i++) {
          await subirImagenSubastaMatriculado(
            id,
            imagenesNuevas[i],
            baseOrden + i + 1
          )
        }
      }

      toast({ title: "Listo", description: "Edicto actualizado correctamente." })
      router.push("/panel/subastas")
    } catch (err: unknown) {
      const errObj = err as {
        status?: number
        data?: { message?: string; errors?: Record<string, string> }
        message?: string
      }
      const msg = errObj?.data?.message ?? errObj?.message
      setError((msg as string) ?? "Error al actualizar el edicto.")
      if (errObj?.data?.errors) {
        setFieldErrors(errObj.data.errors)
      }
      toast({
        title: "Error",
        description: (msg as string) ?? "Error al actualizar el edicto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!subasta) {
    return (
      <div>
        <p className="text-muted-foreground">
          Edicto no encontrado o no puede editarlo.
        </p>
        <Button variant="link" asChild>
          <Link href="/panel/subastas">Volver a Mis edictos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/panel/subastas"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mis edictos
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">Editar edicto</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="list-disc list-inside mt-2">
              {Object.entries(fieldErrors).map(([field, text]) => (
                <li key={field}>
                  {field}: {text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Card className="mb-8 border-primary/20 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Martillero a cargo
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Matrícula</p>
            <p className="font-medium">{perfilMartillero.matricula}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nombre</p>
            <p className="font-medium">{perfilMartillero.nombre}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CUIT</p>
            <p className="font-medium">{perfilMartillero.cuit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Celular</p>
            <p className="font-medium">{perfilMartillero.telefono}</p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            required
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precioInicial">Base</Label>
            <Input
              id="precioInicial"
              type="number"
              min={1}
              required
              value={form.precioInicial || ""}
              onChange={(e) =>
                setForm({ ...form, precioInicial: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incrementos">Incrementos</Label>
            <Input
              id="incrementos"
              type="number"
              min={0}
              value={form.incrementos || ""}
              onChange={(e) =>
                setForm({ ...form, incrementos: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="domicilio">Domicilio del remate</Label>
          <Input
            id="domicilio"
            required
            value={form.domicilio}
            onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
          />
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Edicto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edictoTexto">Texto completo del edicto</Label>
              <Textarea
                id="edictoTexto"
                required
                rows={6}
                value={form.edictoTexto}
                onChange={(e) =>
                  setForm({ ...form, edictoTexto: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroEdicto">Número de edicto / referencia</Label>
              <Input
                id="numeroEdicto"
                value={form.numeroEdicto}
                onChange={(e) =>
                  setForm({ ...form, numeroEdicto: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Fechas de publicación en el Boletín Oficial</Label>
              <FechasBoletinCalendar
                value={fechasBoletin}
                onChange={setFechasBoletin}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-primary" />
            Imágenes
          </Label>
          {imagenesExistentes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imagenesExistentes.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-video rounded-lg border border-border overflow-hidden"
                >
                  <Image
                    src={img.fileUrl}
                    alt={img.fileName}
                    fill
                    className="object-cover"
                    unoptimized={img.fileUrl.startsWith("http")}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    disabled={deletingImagenId === img.id}
                    onClick={() => handleEliminarImagen(img.id)}
                  >
                    {deletingImagenId === img.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Input
            type="file"
            accept={ACCEPT_IMAGES}
            multiple
            className="cursor-pointer"
            onChange={(e) => {
              const list = e.target.files ? Array.from(e.target.files) : []
              setImagenesNuevas(list)
            }}
          />
          {imagenesNuevas.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {imagenesNuevas.length} imagen(es) nueva(s) para subir al guardar.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button type="button" variant="secondary" onClick={handleVistaPrevia}>
            Vista previa
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/panel/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
