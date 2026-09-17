"use client"

import { useEffect, useId, useRef, useState } from "react"
import { FilePlus, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const ALLOWED_IMAGES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
])
const PDF = "application/pdf"
const ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf,.pdf"

type NoticiaImagenesPickerProps = {
  files: File[]
  onChange: (files: File[]) => void
  label?: string
}

function isAllowed(file: File) {
  if (ALLOWED_IMAGES.has(file.type) || file.type === PDF) return true
  // Algunos navegadores mandan type vacío
  return file.name.toLowerCase().endsWith(".pdf")
}

export function NoticiaImagenesPicker({
  files,
  onChange,
  label = "Archivos (imágenes o PDF)",
}: NoticiaImagenesPickerProps) {
  const { toast } = useToast()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<{ url: string; isPdf: boolean }[]>(
    []
  )

  useEffect(() => {
    if (!files.length) {
      setPreviews([])
      return
    }
    let cancelled = false
    Promise.all(
      files.map(
        (file) =>
          new Promise<{ url: string; isPdf: boolean }>((resolve, reject) => {
            const isPdf =
              file.type === PDF || file.name.toLowerCase().endsWith(".pdf")
            if (isPdf) {
              resolve({ url: "", isPdf: true })
              return
            }
            const reader = new FileReader()
            reader.onload = () =>
              resolve({ url: reader.result as string, isPdf: false })
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          })
      )
    ).then((urls) => {
      if (!cancelled) setPreviews(urls)
    })
    return () => {
      cancelled = true
    }
  }, [files])

  const agregar = (selected: FileList | null) => {
    const list = Array.from(selected ?? [])
    const valid = list.filter(isAllowed)
    if (valid.length !== list.length) {
      toast({
        title: "Algunos archivos no son válidos",
        description: "Solo imágenes (JPEG, PNG, WebP, GIF) o PDF.",
        variant: "destructive",
      })
    }
    if (!valid.length) return

    const existentes = new Set(
      files.map((f) => `${f.name}-${f.size}-${f.lastModified}`)
    )
    const nuevos = valid.filter(
      (f) => !existentes.has(`${f.name}-${f.size}-${f.lastModified}`)
    )
    onChange([...files, ...nuevos])
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
        Podés subir varias imágenes y/o PDFs. La primera imagen será la portada
        del listado. Si hay más de una imagen, se muestra como carrusel.
      </p>
      {files.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {files.length} archivo{files.length === 1 ? "" : "s"} seleccionado
            {files.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {files.map((file, i) => {
              const preview = previews[i]
              const isPdf =
                preview?.isPdf ||
                file.type === PDF ||
                file.name.toLowerCase().endsWith(".pdf")
              return (
                <div key={`${file.name}-${i}`} className="relative group">
                  {isPdf ? (
                    <div className="aspect-video w-full rounded border bg-muted flex flex-col items-center justify-center gap-1 p-2">
                      <FileText className="h-8 w-8 text-primary" />
                      <span className="text-[10px] text-center line-clamp-2 px-1">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview?.url}
                      alt={`Archivo ${i + 1}`}
                      className="aspect-video w-full object-cover rounded border"
                    />
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 opacity-90"
                    onClick={() => quitar(i)}
                    aria-label={`Quitar archivo ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {i === 0 && !isPdf && (
                    <span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
                      Portada
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Agregar más archivos
          </Button>
        </>
      )}
    </div>
  )
}
