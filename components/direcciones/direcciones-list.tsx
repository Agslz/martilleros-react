import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for demonstration
const sedes = [
  {
    id: 1,
    nombre: "Sede Central",
    tipo: "principal",
    direccion: "Av. San Martín 1234",
    localidad: "Ciudad, Mendoza",
    codigoPostal: "5500",
    telefono: "(0261) 123-4567",
    telefonoAlt: "(0261) 123-4568",
    email: "info@martillerosmendoza.org.ar",
    horario: "Lunes a Viernes de 9:00 a 14:00 hs",
    servicios: ["Atención al público", "Matriculación", "Trámites administrativos", "Mesa de entradas"],
  },
  {
    id: 2,
    nombre: "Delegación San Rafael",
    tipo: "delegacion",
    direccion: "Calle Independencia 456",
    localidad: "San Rafael, Mendoza",
    codigoPostal: "5600",
    telefono: "(0260) 123-4567",
    email: "sanrafael@martillerosmendoza.org.ar",
    horario: "Lunes, Miércoles y Viernes de 9:00 a 13:00 hs",
    servicios: ["Atención al público", "Recepción de trámites"],
  },
  {
    id: 3,
    nombre: "Delegación General Alvear",
    tipo: "delegacion",
    direccion: "Av. Libertador 789",
    localidad: "General Alvear, Mendoza",
    codigoPostal: "5620",
    telefono: "(0260) 987-6543",
    email: "gralvear@martillerosmendoza.org.ar",
    horario: "Martes y Jueves de 9:00 a 13:00 hs",
    servicios: ["Atención al público", "Recepción de trámites"],
  },
  {
    id: 4,
    nombre: "Delegación Tunuyán",
    tipo: "delegacion",
    direccion: "Calle San Martín 321",
    localidad: "Tunuyán, Mendoza",
    codigoPostal: "5560",
    telefono: "(02622) 12-3456",
    email: "tunuyan@martillerosmendoza.org.ar",
    horario: "Lunes y Viernes de 9:00 a 13:00 hs",
    servicios: ["Atención al público", "Recepción de trámites"],
  },
]

export function DireccionesList() {
  return (
    <div className="space-y-6">
      {sedes.map((sede) => (
        <article
          key={sede.id}
          className={`bg-card rounded-xl border overflow-hidden ${
            sede.tipo === "principal" 
              ? "border-primary/30 ring-1 ring-primary/10" 
              : "border-border"
          }`}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {sede.nombre}
                  </h2>
                  {sede.tipo === "principal" ? (
                    <Badge className="bg-primary text-primary-foreground">
                      Sede Principal
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Delegación</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{sede.direccion}</p>
                      <p className="text-sm text-muted-foreground">
                        {sede.localidad} (CP {sede.codigoPostal})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{sede.telefono}</p>
                      {sede.telefonoAlt && (
                        <p className="text-sm text-muted-foreground">{sede.telefonoAlt}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{sede.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Horario</p>
                      <p className="text-sm text-muted-foreground">{sede.horario}</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Servicios disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {sede.servicios.map((servicio) => (
                      <Badge key={servicio} variant="outline" className="text-xs">
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="lg:w-72 shrink-0">
                <div className="aspect-[4/3] lg:aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Ver en mapa</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir en Google Maps
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
