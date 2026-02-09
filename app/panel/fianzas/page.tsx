"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Upload, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFianzas, subirFianza, type FianzaResponse } from "@/lib/api"

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

export default function PanelFianzasPage() {
  const [list, setList] = useState<FianzaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaVencimiento, setFechaVencimiento] = useState("")

  const load = () => {
    setLoading(true)
    getFianzas()
      .then(setList)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !fechaInicio || !fechaVencimiento) {
      setError("Completá archivo y fechas.")
      return
    }
    setError(null)
    setSuccess(null)
    setUploading(true)
    try {
      const created = await subirFianza(file, fechaInicio, fechaVencimiento)
      if (created) {
        setSuccess("Fianza subida correctamente.")
        setFile(null)
        setFechaInicio("")
        setFechaVencimiento("")
        load()
      } else {
        setError("No se pudo subir la fianza.")
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : null
      setError(msg ?? "Error al subir la fianza.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis fianzas</h1>

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

      <div className="max-w-xl rounded-xl border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Subir constancia de fianza
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Archivo PDF</Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha inicio (YYYY-MM-DD)</Label>
              <Input
                id="fechaInicio"
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha vencimiento (YYYY-MM-DD)</Label>
              <Input
                id="fechaVencimiento"
                type="date"
                required
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Subir fianza
          </Button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Historial
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-muted-foreground">No hay fianzas cargadas.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Inicio</th>
                <th className="text-left p-4 font-semibold">Vencimiento</th>
                <th className="text-left p-4 font-semibold">Constancia</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="p-4">{formatFecha(f.fechaInicio)}</td>
                  <td className="p-4">{formatFecha(f.fechaVencimiento)}</td>
                  <td className="p-4">
                    <a
                      href={f.constanciaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Ver PDF
                      <ExternalLink className="h-3 w-3" />
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
