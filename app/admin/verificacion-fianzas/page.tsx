"use client"

import { useEffect, useState } from "react"
import {
  Shield,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getFianzasPendientesAdmin,
  aprobarFianzaAdmin,
  notificarRechazoFianzaAdmin,
} from "@/lib/api"
import { resolveStorageFileUrl } from "@/lib/storage-url"
import type { FianzaPendienteAdminResponse } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminVerificacionFianzasPage() {
  const [list, setList] = useState<FianzaPendienteAdminResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [backendNoDisponible, setBackendNoDisponible] = useState(false)
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [rechazoFianza, setRechazoFianza] = useState<FianzaPendienteAdminResponse | null>(null)
  const [rechazoMensaje, setRechazoMensaje] = useState("")
  const [rechazoCampos, setRechazoCampos] = useState("")
  const [sendingRechazo, setSendingRechazo] = useState(false)
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    setBackendNoDisponible(false)
    getFianzasPendientesAdmin()
      .then(setList)
      .catch((err: Error & { status?: number }) => {
        if (err.status === 404 || err.message?.includes("404")) {
          setBackendNoDisponible(true)
          setList([])
        } else {
          toast({
            title: "Error",
            description: err.message ?? "No se pudo cargar el listado de fianzas pendientes.",
            variant: "destructive",
          })
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleAprobar = async (item: FianzaPendienteAdminResponse) => {
    setApprovingId(item.id)
    try {
      await aprobarFianzaAdmin(item.id)
      toast({
        title: "Matriculado habilitado",
        description: `${item.apellido}, ${item.nombre} (${item.matricula}) quedó habilitado para ejercer.`,
      })
      load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo aprobar la fianza."
      const es404 = err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404
      toast({
        title: "Error",
        description: es404
          ? "El backend aún no expone POST /api/admin/fianzas/{id}/aprobar."
          : msg,
        variant: "destructive",
      })
    } finally {
      setApprovingId(null)
    }
  }

  const handleAbrirRechazo = (item: FianzaPendienteAdminResponse) => {
    setRechazoFianza(item)
    setRechazoMensaje("")
    setRechazoCampos("")
  }

  const handleEnviarRechazo = async () => {
    if (!rechazoFianza || !rechazoMensaje.trim()) return
    setSendingRechazo(true)
    try {
      await notificarRechazoFianzaAdmin(rechazoFianza.id, {
        mensaje: rechazoMensaje.trim(),
        camposIncorrectos: rechazoCampos.trim() || undefined,
      })
      toast({
        title: "Correo enviado",
        description: `Se notificó a ${rechazoFianza.apellido}, ${rechazoFianza.nombre} (${rechazoFianza.matricula}).`,
      })
      setRechazoFianza(null)
      load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "No se pudo enviar el correo."
      const es404 = err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404
      toast({
        title: "Error",
        description: es404
          ? "El backend aún no expone POST /api/admin/fianzas/{id}/notificar-rechazo."
          : msg,
        variant: "destructive",
      })
    } finally {
      setSendingRechazo(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Verificación de fianzas
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        El matriculado sube la constancia de fianza (cada 5 años). Acá podés ver el archivo,
        habilitarlo si está todo bien o enviarle un correo indicando qué debe corregir.
      </p>

      {backendNoDisponible && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            El backend aún no expone los endpoints de verificación de fianzas (GET
            /api/admin/fianzas/pendientes, POST .../aprobar, POST .../notificar-rechazo).
            Ver <strong>FRONTEND_API_DOCUMENTACION.md</strong> en cm-backend (fianzas admin).
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : list.length === 0 && !backendNoDisponible ? (
        <p className="text-muted-foreground py-8">
          No hay fianzas pendientes de verificación.
        </p>
      ) : list.length === 0 ? null : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Matrícula</TableHead>
                <TableHead className="font-semibold">Apellido</TableHead>
                <TableHead className="font-semibold">Nombre</TableHead>
                <TableHead className="font-semibold">Fecha subida</TableHead>
                <TableHead className="font-semibold">Vigencia</TableHead>
                <TableHead className="font-semibold text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item) => {
                const constanciaHref = resolveStorageFileUrl(item.constanciaUrl)
                return (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{item.matricula}</TableCell>
                  <TableCell>{item.apellido}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.fechaInicio} – {item.fechaVencimiento}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {constanciaHref ? (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={constanciaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver archivo
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          title="El enlace al PDF no está disponible. En producción el backend debe devolver una URL pública (S3)."
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Sin enlace
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={approvingId === item.id}
                        onClick={() => handleAprobar(item)}
                      >
                        {approvingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Habilitar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAbrirRechazo(item)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Informar por correo
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!rechazoFianza} onOpenChange={(open) => !open && setRechazoFianza(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar correo al matriculado</DialogTitle>
            <DialogDescription>
              {rechazoFianza && (
                <>
                  Se enviará un correo a {rechazoFianza.nombre} {rechazoFianza.apellido} (
                  {rechazoFianza.matricula})
                  {rechazoFianza.email ? ` a ${rechazoFianza.email}` : ""}. Indicá qué debe
                  corregir en la constancia de fianza.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rechazo-mensaje">Mensaje (obligatorio)</Label>
              <Textarea
                id="rechazo-mensaje"
                placeholder="Ej.: La fecha de vencimiento no coincide con el documento. Por favor suba nuevamente la constancia correcta."
                value={rechazoMensaje}
                onChange={(e) => setRechazoMensaje(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rechazo-campos">Campos incorrectos (opcional)</Label>
              <Textarea
                id="rechazo-campos"
                placeholder="Ej.: Fecha de vencimiento, Número de constancia"
                value={rechazoCampos}
                onChange={(e) => setRechazoCampos(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRechazoFianza(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEnviarRechazo}
              disabled={!rechazoMensaje.trim() || sendingRechazo}
            >
              {sendingRechazo ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Enviar correo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
