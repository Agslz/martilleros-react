"use client"

import { useEffect, useState } from "react"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContenido, actualizarContenido, type ContenidoKey } from "@/lib/api"
import type { ContenidoResponse } from "@/lib/api"
import {
  parseContactoContenido,
  parseHomeContenido,
  serializeContactoContenido,
  serializeHomeContenido,
  type ContactoContenidoData,
  type HomeContenidoData,
} from "@/lib/contenidos"

const KEYS: ContenidoKey[] = ["HOME", "CONTACTO"]

const EMPTY_HOME: HomeContenidoData = {
  intro: { titulo: "", cuerpo: "" },
  sobre: { titulo: "", cuerpo: "" },
}

const EMPTY_CONTACTO: ContactoContenidoData = {
  telefono: "",
  correo: "",
  direccion: "",
}

export default function AdminContenidosPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contents, setContents] = useState<Record<string, ContenidoResponse | null>>({})
  const [activeKey, setActiveKey] = useState<ContenidoKey>("HOME")
  const [homeForm, setHomeForm] = useState<HomeContenidoData>(EMPTY_HOME)
  const [contactoForm, setContactoForm] =
    useState<ContactoContenidoData>(EMPTY_CONTACTO)

  const loadContent = (key: ContenidoKey) => {
    getContenido(key).then((c) => {
      setContents((prev) => ({ ...prev, [key]: c }))
      if (key === "HOME") {
        setHomeForm(parseHomeContenido(c))
      } else if (key === "CONTACTO") {
        setContactoForm(parseContactoContenido(c))
      }
    })
  }

  useEffect(() => {
    KEYS.forEach(loadContent)
  }, [])

  useEffect(() => {
    const c = contents[activeKey]
    if (activeKey === "HOME") {
      setHomeForm(parseHomeContenido(c))
    } else if (activeKey === "CONTACTO") {
      setContactoForm(parseContactoContenido(c))
    }
  }, [activeKey, contents])

  const handleSubmitHome = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const updated = await actualizarContenido("HOME", serializeHomeContenido(homeForm))
      if (updated) {
        setContents((prev) => ({ ...prev, HOME: updated }))
        setSuccess("Contenido de portada guardado.")
      } else {
        setError("No se pudo guardar.")
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al guardar.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitContacto = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const updated = await actualizarContenido(
        "CONTACTO",
        serializeContactoContenido(contactoForm)
      )
      if (updated) {
        setContents((prev) => ({ ...prev, CONTACTO: updated }))
        setSuccess("Datos de contacto guardados.")
      } else {
        setError("No se pudo guardar.")
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : null
      setError(msg ?? "Error al guardar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Contenidos</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Editá los textos de la portada y los datos de contacto del sitio.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      <Tabs value={activeKey} onValueChange={(v) => setActiveKey(v as ContenidoKey)}>
        <TabsList className="mb-6">
          {KEYS.map((k) => (
            <TabsTrigger key={k} value={k}>
              {k === "HOME" ? "Portada" : "Contacto"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="HOME">
          <form onSubmit={handleSubmitHome} className="max-w-2xl space-y-8">
            <div className="rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-foreground">
                Texto principal de la portada
              </h2>
              <p className="text-sm text-muted-foreground">
                Título y párrafo debajo del carrusel de imágenes.
              </p>
              <div className="space-y-2">
                <Label htmlFor="intro-titulo">Título</Label>
                <Input
                  id="intro-titulo"
                  required
                  value={homeForm.intro.titulo}
                  onChange={(e) =>
                    setHomeForm({
                      ...homeForm,
                      intro: { ...homeForm.intro, titulo: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intro-cuerpo">Cuerpo</Label>
                <Textarea
                  id="intro-cuerpo"
                  required
                  rows={5}
                  value={homeForm.intro.cuerpo}
                  onChange={(e) =>
                    setHomeForm({
                      ...homeForm,
                      intro: { ...homeForm.intro, cuerpo: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Sobre nosotros</h2>
              <p className="text-sm text-muted-foreground">
                Título y texto de la sección «Sobre nosotros» en la portada. Podés
                separar párrafos con una línea en blanco.
              </p>
              <div className="space-y-2">
                <Label htmlFor="sobre-titulo">Título</Label>
                <Input
                  id="sobre-titulo"
                  required
                  value={homeForm.sobre.titulo}
                  onChange={(e) =>
                    setHomeForm({
                      ...homeForm,
                      sobre: { ...homeForm.sobre, titulo: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobre-cuerpo">Cuerpo</Label>
                <Textarea
                  id="sobre-cuerpo"
                  required
                  rows={6}
                  value={homeForm.sobre.cuerpo}
                  onChange={(e) =>
                    setHomeForm({
                      ...homeForm,
                      sobre: { ...homeForm.sobre, cuerpo: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Guardar portada
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="CONTACTO">
          <form onSubmit={handleSubmitContacto} className="max-w-xl space-y-6">
            <p className="text-sm text-muted-foreground">
              Se muestran en la página de contacto y en el pie del sitio. La
              dirección abre Google Maps al tocarla.
            </p>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                required
                placeholder="2617570100"
                value={contactoForm.telefono}
                onChange={(e) =>
                  setContactoForm({ ...contactoForm, telefono: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                required
                placeholder="colegio@ejemplo.com"
                value={contactoForm.correo}
                onChange={(e) =>
                  setContactoForm({ ...contactoForm, correo: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                required
                placeholder="Calle, número, ciudad"
                value={contactoForm.direccion}
                onChange={(e) =>
                  setContactoForm({ ...contactoForm, direccion: e.target.value })
                }
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Guardar contacto
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
