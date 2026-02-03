import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Dirección",
    content: ["Av. San Martín 1234", "Ciudad, Mendoza", "Argentina"],
  },
  {
    icon: Phone,
    title: "Teléfono",
    content: ["(0261) 123-4567", "(0261) 123-4568"],
  },
  {
    icon: Mail,
    title: "Email",
    content: ["info@martillerosmendoza.org.ar", "consultas@martillerosmendoza.org.ar"],
  },
  {
    icon: Clock,
    title: "Horario de Atención",
    content: ["Lunes a Viernes", "9:00 a 14:00 hs"],
  },
]

export function ContactoInfo() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Información de Contacto
      </h2>
      
      <div className="space-y-6">
        {contactInfo.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              {item.content.map((line, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="mt-8 aspect-video rounded-lg bg-muted flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Mapa de ubicación</p>
        </div>
      </div>
    </div>
  )
}
