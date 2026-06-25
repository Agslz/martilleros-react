"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, User, ImagePlus, FileText } from "lucide-react"
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
  crearSubastaMatriculado,
  subirImagenSubastaMatriculado,
  type CrearSubastaMatriculadoRequest,
} from "@/lib/api"
import { displayCuit } from "@/lib/cuit"
import { displayTelefono } from "@/lib/telefono"
import { guardarBorradorVistaPrevia } from "@/lib/edicto-preview"
import { useToast } from "@/hooks/use-toast"

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

export default function PanelNuevoEdictoPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [userLoaded, setUserLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [imagenes, setImagenes] = useState<File[]>([])
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
    getCurrentUser().then((user) => {
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
      setUserLoaded(true)
    })
  }, [])

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

  const handleVistaPrevia = () => {
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

    const imagenUrls = imagenes.map((file) => URL.createObjectURL(file))
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
      imagenUrls,
    })
    window.open("/panel/subastas/vista-previa", "_blank", "noopener,noreferrer")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const validationError = validarFormulario()
    if (validationError) {
      setError(validationError)
      if (validationError.includes("edicto")) {
        setFieldErrors((prev) => ({ ...prev, edictoTexto: "Requerido." }))
      }
      if (validationError.includes("boletín") || validationError.includes("fecha")) {
        setFieldErrors((prev) => ({
          ...prev,
          fechasPublicacionBoletin: validationError,
        }))
      }
      toast({
        title: "Revise el formulario",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    const edictoTrim = form.edictoTexto.trim()
    setLoading(true)
    try {
      const body: CrearSubastaMatriculadoRequest = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precioInicial: form.precioInicial,
        domicilio: form.domicilio,
        edictoTexto: edictoTrim,
        fechasPublicacionBoletin: fechasBoletin,
      }
      if (form.numeroEdicto.trim()) {
        body.numeroEdicto = form.numeroEdicto.trim()
      }
      if (form.incrementos > 0) {
        body.incrementos = form.incrementos
      }

      const created = await crearSubastaMatriculado(body)
      if (!created) {
        setError("No se pudo crear el edicto.")
        setLoading(false)
        return
      }

      if (imagenes.length > 0) {
        let ok = 0
        let fail = 0
        for (let i = 0; i < imagenes.length; i++) {
          try {
            const res = await subirImagenSubastaMatriculado(
              created.id,
              imagenes[i],
              i + 1
            )
            if (res) ok++
            else fail++
          } catch {
            fail++
          }
        }
        if (fail > 0) {
          toast({
            title: "Edicto creado",
            description: `Se subieron ${ok} imagen(es). No se pudieron subir ${fail}.`,
          })
        } else {
          toast({
            title: "Listo",
            description: `Edicto creado con ${ok} imagen(es).`,
          })
        }
      } else {
        toast({
          title: "Listo",
          description: "Edicto creado correctamente.",
        })
      }
      router.push("/panel/subastas")
    } catch (err: unknown) {
      const errObj = err as {
        status?: number
        data?: { message?: string; errors?: Record<string, string> }
        message?: string
      }
      const msg = errObj?.data?.message ?? errObj?.message
      const errors = errObj?.data?.errors
      const isForbidden = errObj?.status === 403
      setError(
        isForbidden
          ? "El backend aún no permite crear edictos desde el panel. Contacte al Colegio."
          : (msg as string) ?? "Error al crear el edicto."
      )
      if (errors && typeof errors === "object") {
        setFieldErrors(errors)
      }
      toast({
        title: "Error",
        description: isForbidden
          ? "Acción no disponible. Contacte al Colegio."
          : (msg as string) ?? "Error al crear el edicto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!userLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Nuevo edicto</h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm space-y-2">
          <p>{error}</p>
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {Object.entries(fieldErrors).map(([field, text]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span> {text}
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
            Martillero a cargo (datos de su perfil)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Matrícula</p>
            <p className="font-medium">{perfilMartillero.matricula || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nombre</p>
            <p className="font-medium">{perfilMartillero.nombre || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CUIT</p>
            <p className="font-medium">{perfilMartillero.cuit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Celular</p>
            <p className="font-medium">{perfilMartillero.telefono}</p>
          </div>
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Estos datos se toman de su sesión. No hace falta cargarlos en el
            formulario.
          </p>
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
            <p className="text-sm text-muted-foreground font-normal">
              Texto del edicto publicado en el Boletín Oficial de Mendoza.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edictoTexto">Texto completo del edicto</Label>
              <Textarea
                id="edictoTexto"
                required
                rows={6}
                placeholder="Pegá aquí el texto del edicto tal como figura en el Boletín Oficial..."
                value={form.edictoTexto}
                onChange={(e) => setForm({ ...form, edictoTexto: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroEdicto">Número de edicto / referencia</Label>
              <Input
                id="numeroEdicto"
                placeholder="Ej. Edicto N.º 12345 BO-2026-03-15"
                value={form.numeroEdicto}
                onChange={(e) => setForm({ ...form, numeroEdicto: e.target.value })}
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

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-primary" />
            Imágenes (opcional)
          </Label>
          <Input
            id="imagenes"
            type="file"
            accept={ACCEPT_IMAGES}
            multiple
            className="cursor-pointer"
            onChange={(e) => {
              const list = e.target.files ? Array.from(e.target.files) : []
              setImagenes(list)
            }}
          />
          {imagenes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {imagenes.length} archivo(s) seleccionado(s).
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button type="button" variant="secondary" onClick={handleVistaPrevia}>
            Vista previa
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Publicar edicto
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/panel/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
