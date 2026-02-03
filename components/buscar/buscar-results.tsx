"use client"

import { CheckCircle2, XCircle, User, Phone, Mail, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock result for demonstration
const mockResult = {
  found: true,
  matriculado: {
    matricula: "M-0001",
    nombre: "Juan Carlos",
    apellido: "González",
    estado: "habilitado",
    fechaMatricula: "15/03/1995",
    especialidad: "Martillero y Corredor Público",
    domicilioLegal: "Av. San Martín 1234, Ciudad, Mendoza",
    telefono: "(0261) 123-4567",
    email: "jcgonzalez@ejemplo.com",
  },
}

export function BuscarResults() {
  // This would be controlled by actual search state
  const showResults = true
  const result = mockResult

  if (!showResults) return null

  return (
    <div className="mt-8">
      {result.found ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 flex items-center gap-3 ${
            result.matriculado.estado === "habilitado" 
              ? "bg-green-50 border-b border-green-100" 
              : "bg-red-50 border-b border-red-100"
          }`}>
            {result.matriculado.estado === "habilitado" ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Martillero Habilitado</p>
                  <p className="text-sm text-green-600">
                    Este profesional está habilitado para ejercer en Mendoza
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Martillero Suspendido</p>
                  <p className="text-sm text-red-600">
                    Este profesional NO está habilitado actualmente
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {result.matriculado.apellido}, {result.matriculado.nombre}
                </h3>
                <p className="text-muted-foreground">{result.matriculado.especialidad}</p>
                <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/10">
                  {result.matriculado.matricula}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Domicilio Legal</p>
                  <p className="font-medium text-foreground">{result.matriculado.domicilioLegal}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium text-foreground">{result.matriculado.telefono}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{result.matriculado.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Matriculado desde</p>
                  <p className="font-medium text-foreground">{result.matriculado.fechaMatricula}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <XCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No se encontraron resultados</h3>
          <p className="mt-2 text-muted-foreground">
            No existe un martillero con los datos ingresados en nuestro registro.
          </p>
        </div>
      )}
    </div>
  )
}
