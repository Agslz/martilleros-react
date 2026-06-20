"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContenido, actualizarContenido, type ContenidoKey } from "@/lib/api"
import type { ContenidoResponse } from "@/lib/api"

const KEYS: ContenidoKey[] = ["HOME", "CONTACTO", "TEXTOS"]

export default function AdminContenidosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contents, setContents] = useState<Record<string, ContenidoResponse | null>>({})
  const [activeKey, setActiveKey] = useState<ContenidoKey>("HOME")
  const [form, setForm] = useState({ titulo: "", cuerpo: "" })

  const loadContent = (key: ContenidoKey) => {
    getContenido(key).then((c) => {
      setContents((prev) => ({ ...prev, [key]: c }))
      if (c) setForm({ titulo: c.titulo, cuerpo: c.cuerpo })
      else setForm({ titulo: "", cuerpo: "" })
    })
  }

  useEffect(() => {
    KEYS.forEach(loadContent)
  }, [])

  useEffect(() => {
    const c = contents[activeKey]
    if (c) setForm({ titulo: c.titulo, cuerpo: c.cuerpo })
    else setForm({ titulo: "", cuerpo: "" })
  }, [activeKey, contents])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const updated = await actualizarContenido(activeKey, form)
      if (updated) {
        setContents((prev) => ({ ...prev, [activeKey]: updated }))
        setSuccess("Contenido guardado.")
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Contenidos</h1>

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
              {k}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeKey}>
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
              <Label htmlFor="cuerpo">Cuerpo (puede incluir HTML)</Label>
              <Textarea
                id="cuerpo"
                required
                rows={12}
                className="font-mono text-sm"
                value={form.cuerpo}
                onChange={(e) => setForm({ ...form, cuerpo: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Guardar {activeKey}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
