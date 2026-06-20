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
  getCurrentUser,
  crearSubastaMatriculado,
  subirImagenSubastaMatriculado,
  type CrearSubastaMatriculadoRequest,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif"

export default function PanelNuevaSubastaPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [userLoaded, setUserLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [imagenes, setImagenes] = useState<File[]>([])
  const [perfilMartillero, setPerfilMartillero] = useState({
    matricula: "",
    nombre: "",
  })
  const [form, setForm] = useState<CrearSubastaMatriculadoRequest>({
    titulo: "",
    descripcion: "",
    precioInicial: 0,
    domicilio: "",
    fechaInicio: "",
    fechaFin: "",
    edictoTexto: "",
    numeroEdicto: "",
    fechaPublicacionBoletin: "",
  })

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setPerfilMartillero({
          matricula: user.matricula,
          nombre: [user.nombre, user.apellido].filter(Boolean).join(" "),
        })
      }
      setUserLoaded(true)
    })
  }, [])

  const setFechaInicio = (fechaInicio: string) => {
    setForm((f) => ({
      ...f,
      fechaInicio,
      fechaPublicacionBoletin: f.fechaPublicacionBoletin
        ? fechaInicio
        : f.fechaPublicacionBoletin,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    const edictoTrim = (form.edictoTexto ?? "").trim()
    if (!edictoTrim) {
      setError("El texto completo del edicto es obligatorio.")
      setFieldErrors((prev) => ({ ...prev, edictoTexto: "Requerido." }))
      toast({
        title: "Falta el edicto",
        description: "Debe cargar el texto del edicto publicado en el Boletín Oficial.",
        variant: "destructive",
      })
      return
    }
    const fechaBoletin = (form.fechaPublicacionBoletin ?? "").trim()
    if (fechaBoletin && fechaBoletin !== form.fechaInicio) {
      setError(
        "La fecha de publicación en el Boletín debe coincidir con la fecha de inicio."
      )
      setFieldErrors((prev) => ({
        ...prev,
        fechaPublicacionBoletin: "Debe ser igual a la fecha de inicio.",
      }))
      toast({
        title: "Fechas inconsistentes",
        description: "Ajustá la fecha del Boletín o la fecha de inicio.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const body: CrearSubastaMatriculadoRequest = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precioInicial: form.precioInicial,
        domicilio: form.domicilio,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        edictoTexto: edictoTrim,
      }
      if ((form.numeroEdicto ?? "").trim()) {
        body.numeroEdicto = form.numeroEdicto!.trim()
      }
      if (fechaBoletin) {
        body.fechaPublicacionBoletin = fechaBoletin
      }

      // 1) Crear subasta
      const created = await crearSubastaMatriculado(body)
      if (!created) {
        setError("No se pudo crear la subasta.")
        setLoading(false)
        return
      }

      // 2) Subir imágenes (endpoint 2: una petición por imagen)
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
            title: "Subasta creada",
            description: `Se subieron ${ok} imagen(es). No se pudieron subir ${fail}. Podés agregar más desde el detalle de la subasta.`,
            variant: "default",
          })
        } else {
          toast({
            title: "Listo",
            description: `Subasta creada con ${ok} imagen(es).`,
          })
        }
      } else {
        toast({
          title: "Listo",
          description: "Subasta creada correctamente.",
        })
      }
      router.push("/panel/subastas")
      return
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
          ? "El backend aún no permite crear subastas desde el panel de matriculados. Contacte al Colegio."
          : (msg as string) ?? "Error al crear la subasta."
      )
      if (errors && typeof errors === "object") {
        setFieldErrors(errors)
      }
      toast({
        title: "Error",
        description: isForbidden
          ? "Acción no disponible. Contacte al Colegio."
          : (msg as string) ?? "Error al crear la subasta.",
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
        Volver a Mis subastas
      </Link>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nueva subasta</h1>

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
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            El backend toma matrícula, nombre y CUIT de su sesión; no hace falta
            enviarlos en el formulario.
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
            <Label htmlFor="precioInicial">Precio inicial</Label>
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
            <Label htmlFor="domicilio">Domicilio de la subasta</Label>
            <Input
              id="domicilio"
              required
              value={form.domicilio}
              onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha inicio (YYYY-MM-DD)</Label>
            <Input
              id="fechaInicio"
              type="date"
              required
              value={form.fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha fin (YYYY-MM-DD)</Label>
            <Input
              id="fechaFin"
              type="date"
              required
              value={form.fechaFin}
              onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            />
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Edicto
            </CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              Texto del edicto publicado en el Boletín Oficial de Mendoza. El PDF
              lo genera el boletín al publicarse; aquí solo cargás el texto y la
              referencia. Se mostrará en la página pública de la subasta.
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
                value={form.edictoTexto ?? ""}
                onChange={(e) => setForm({ ...form, edictoTexto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroEdicto">Número de edicto / referencia</Label>
                <Input
                  id="numeroEdicto"
                  placeholder="Ej. Edicto N.º 12345 BO-2026-03-15"
                  value={form.numeroEdicto ?? ""}
                  onChange={(e) => setForm({ ...form, numeroEdicto: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaPublicacionBoletin">
                  Fecha publicación en Boletín (opcional)
                </Label>
                <Input
                  id="fechaPublicacionBoletin"
                  type="date"
                  value={form.fechaPublicacionBoletin ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fechaPublicacionBoletin: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Si la cargás, debe ser el mismo día que la fecha de inicio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-primary" />
            Imágenes (opcional)
          </Label>
          <p className="text-sm text-muted-foreground">
            Podés subir fotos de la subasta. Se enviarán después de crear la subasta. Orden: según el orden en que las seleccionés.
          </p>
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

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Crear subasta
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/panel/subastas">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
