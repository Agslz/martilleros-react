"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { archivosADataUrls } from "@/lib/edicto-preview"
import { useToast } from "@/hooks/use-toast"

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
])

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif"

type NoticiaImagenesPickerProps = {
  files: File[]
  onChange: (files: File[]) => void
  label?: string
}

export function NoticiaImagenesPicker({
  files,
  onChange,
  label = "Imágenes",
}: NoticiaImagenesPickerProps) {
  const { toast } = useToast()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
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

  const agregar = (selected: FileList | null) => {
    const list = Array.from(selected ?? [])
    const valid = list.filter((f) => ALLOWED.has(f.type))
    if (valid.length !== list.length) {
      toast({
        title: "Algunos archivos no son imágenes válidas",
        variant: "destructive",
      })
    }
    if (!valid.length) return

    // Acumula: podés elegir varias de una vez o ir agregando de a una
    const existentes = new Set(files.map((f) => `${f.name}-${f.size}-${f.lastModified}`))
    const nuevos = valid.filter(
      (f) => !existentes.has(`${f.name}-${f.size}-${f.lastModified}`)
    )
    onChange([...files, ...nuevos])

    // Permite volver a abrir el diálogo y elegir más
    if (inputRef.current) inputRef.current.value = ""
  }

  const quitar = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        multiple
        className="block w-full cursor-pointer text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        onChange={(e) => agregar(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Podés seleccionar varias a la vez (Ctrl o Shift) o agregar de a una. La
        primera será la portada del listado.
      </p>
      {files.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {files.length} imagen{files.length === 1 ? "" : "es"} seleccionada
            {files.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {previews.map((url, i) => (
              <div key={`${files[i]?.name}-${i}`} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="aspect-video w-full object-cover rounded border"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 opacity-90"
                  onClick={() => quitar(i)}
                  aria-label={`Quitar imagen ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
                    Portada
                  </span>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Agregar más imágenes
          </Button>
        </>
      )}
    </div>
  )
}
