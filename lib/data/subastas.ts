export interface SubastaImagen {
  id: number
  url: string
  alt: string
}

export interface SubastaProducto {
  id: number
  nombre: string
  descripcion: string
  valorEstimado?: string
}

export interface Subasta {
  id: number
  titulo: string
  descripcion: string
  descripcionCompleta: string
  categoria: "inmuebles" | "vehiculos" | "muebles" | "otros"
  fecha: string
  hora: string
  lugar: string
  direccion: string
  martillero: string
  matricula: string
  telefono: string
  email: string
  baseMinima: string
  estado: "proxima" | "realizada"
  imagenes: SubastaImagen[]
  productos: SubastaProducto[]
  condiciones: string[]
  documentacion: string[]
  // Campos específicos por categoría
  superficie?: string
  ambientes?: number
  cochera?: boolean
  patio?: boolean
  antiguedad?: string
  // Vehículos
  marca?: string
  modelo?: string
  año?: number
  kilometraje?: string
  // Muebles
  cantidadLotes?: number
}

export const subastas: Subasta[] = [
  {
    id: 1,
    titulo: "Subasta de Inmueble - Casa en Godoy Cruz",
    descripcion: "Casa de 3 dormitorios, 2 baños, cochera y patio. Ubicada en zona residencial.",
    descripcionCompleta: "Excelente propiedad ubicada en una de las zonas más cotizadas de Godoy Cruz. La casa cuenta con amplios espacios, living-comedor integrado, cocina equipada, tres dormitorios con placard, dos baños completos, cochera para dos vehículos y un hermoso patio con parrilla. Construcción de primera calidad con terminaciones de alto nivel. Ideal para familia que busca comodidad y seguridad en un barrio tranquilo con todos los servicios.",
    categoria: "inmuebles",
    fecha: "15 de Febrero, 2026",
    hora: "10:00 hs",
    lugar: "Sede del Colegio - Av. San Martín 1234",
    direccion: "Av. San Martín 1234, Ciudad de Mendoza",
    martillero: "Juan Carlos González",
    matricula: "M-0001",
    telefono: "(261) 425-1234",
    email: "jcgonzalez@martilleros.com",
    baseMinima: "$45.000.000",
    estado: "proxima",
    superficie: "280 m²",
    ambientes: 5,
    cochera: true,
    patio: true,
    antiguedad: "15 años",
    imagenes: [
      { id: 1, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop", alt: "Fachada de la casa" },
      { id: 2, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", alt: "Living comedor" },
      { id: 3, url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop", alt: "Cocina" },
      { id: 4, url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop", alt: "Dormitorio principal" },
      { id: 5, url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop", alt: "Patio con parrilla" },
    ],
    productos: [
      { id: 1, nombre: "Propiedad completa", descripcion: "Casa de 3 dormitorios con todas sus instalaciones", valorEstimado: "$45.000.000" },
    ],
    condiciones: [
      "Seña del 10% al momento de la adjudicación",
      "Saldo en 30 días corridos",
      "Escritura a cargo del comprador",
      "Comisión del martillero: 3% + IVA",
      "La propiedad se vende en el estado en que se encuentra",
    ],
    documentacion: [
      "Título de propiedad",
      "Planos aprobados",
      "Libre deuda municipal",
      "Libre deuda de servicios",
      "Informe de dominio",
    ],
  },
  {
    id: 2,
    titulo: "Subasta de Vehículos - Flota Comercial",
    descripcion: "Lote de 5 vehículos utilitarios, modelo 2020-2022. En buen estado de funcionamiento.",
    descripcionCompleta: "Se subastan 5 vehículos utilitarios provenientes de renovación de flota comercial. Todos los vehículos cuentan con service al día, VTV vigente y documentación completa. Los vehículos se encuentran en excelente estado de funcionamiento y pueden ser inspeccionados previo a la subasta coordinando visita con el martillero. Se venden en lote o de manera individual según indicación del martillero durante el acto.",
    categoria: "vehiculos",
    fecha: "20 de Febrero, 2026",
    hora: "14:00 hs",
    lugar: "Galería de Subastas Norte - Las Heras",
    direccion: "Ruta Provincial 40 km 5, Las Heras, Mendoza",
    martillero: "María Elena Rodríguez",
    matricula: "M-0002",
    telefono: "(261) 430-5678",
    email: "merodriguez@martilleros.com",
    baseMinima: "$25.000.000",
    estado: "proxima",
    imagenes: [
      { id: 1, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", alt: "Flota de vehículos" },
      { id: 2, url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop", alt: "Furgoneta blanca" },
      { id: 3, url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop", alt: "Interior vehículo" },
      { id: 4, url: "https://images.unsplash.com/photo-1568844293986-8c9a2c07d934?w=800&h=600&fit=crop", alt: "Camioneta utilitaria" },
    ],
    productos: [
      { id: 1, nombre: "Fiat Fiorino 2022", descripcion: "Utilitario, 45.000 km, blanco", valorEstimado: "$6.500.000" },
      { id: 2, nombre: "Renault Kangoo 2021", descripcion: "Utilitario, 62.000 km, blanco", valorEstimado: "$5.800.000" },
      { id: 3, nombre: "Peugeot Partner 2020", descripcion: "Utilitario, 78.000 km, gris", valorEstimado: "$5.200.000" },
      { id: 4, nombre: "Volkswagen Caddy 2021", descripcion: "Utilitario, 55.000 km, blanco", valorEstimado: "$6.000.000" },
      { id: 5, nombre: "Citroën Berlingo 2020", descripcion: "Utilitario, 81.000 km, blanco", valorEstimado: "$4.800.000" },
    ],
    condiciones: [
      "Pago total al momento de la adjudicación",
      "Transferencia a cargo del comprador",
      "Comisión del martillero: 5% + IVA",
      "Los vehículos se venden en el estado en que se encuentran",
      "Inspección previa coordinando con el martillero",
    ],
    documentacion: [
      "Título automotor",
      "Cédula verde",
      "VTV vigente",
      "Libre deuda de patentes",
      "Libre deuda de infracciones",
    ],
  },
  {
    id: 3,
    titulo: "Subasta de Muebles y Electrodomésticos",
    descripcion: "Mobiliario de oficina, electrodomésticos y equipamiento diverso.",
    descripcionCompleta: "Gran subasta de mobiliario de oficina y electrodomésticos provenientes de empresa en proceso de mudanza. Incluye escritorios ejecutivos, sillas ergonómicas, archivadores, computadoras, impresoras, aire acondicionado split, heladeras comerciales y más. Todo el equipamiento se encuentra en muy buen estado de conservación. Los lotes pueden ser visitados el día previo a la subasta de 10 a 16 hs.",
    categoria: "muebles",
    fecha: "25 de Febrero, 2026",
    hora: "11:00 hs",
    lugar: "Centro de Convenciones - Ciudad",
    direccion: "Peatonal Sarmiento 456, Ciudad de Mendoza",
    martillero: "Carlos Alberto Fernández",
    matricula: "M-0003",
    telefono: "(261) 422-9012",
    email: "cafernandez@martilleros.com",
    baseMinima: "$5.000.000",
    estado: "proxima",
    cantidadLotes: 45,
    imagenes: [
      { id: 1, url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", alt: "Oficina con mobiliario" },
      { id: 2, url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop", alt: "Sofá de oficina" },
      { id: 3, url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop", alt: "Escritorios" },
      { id: 4, url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800&h=600&fit=crop", alt: "Sillas de oficina" },
      { id: 5, url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=600&fit=crop", alt: "Electrodomésticos" },
    ],
    productos: [
      { id: 1, nombre: "Lote 1-10: Escritorios ejecutivos", descripcion: "10 escritorios de madera con cajonera", valorEstimado: "$800.000" },
      { id: 2, nombre: "Lote 11-25: Sillas ergonómicas", descripcion: "15 sillas de oficina con regulación", valorEstimado: "$450.000" },
      { id: 3, nombre: "Lote 26-30: Archivadores", descripcion: "5 archivadores metálicos de 4 cajones", valorEstimado: "$200.000" },
      { id: 4, nombre: "Lote 31-35: Computadoras", descripcion: "5 PC completas con monitor", valorEstimado: "$750.000" },
      { id: 5, nombre: "Lote 36-40: Aires acondicionados", descripcion: "5 splits de 3000 frigorías", valorEstimado: "$600.000" },
      { id: 6, nombre: "Lote 41-45: Electrodomésticos varios", descripcion: "Heladeras, microondas, cafeteras", valorEstimado: "$400.000" },
    ],
    condiciones: [
      "Pago en efectivo o transferencia al momento de la adjudicación",
      "Retiro dentro de las 48 hs de finalizada la subasta",
      "Comisión del martillero: 10% + IVA",
      "Los bienes se venden en el estado en que se encuentran",
      "No se realizan devoluciones",
    ],
    documentacion: [
      "Factura de compra original (cuando aplique)",
      "Garantías vigentes (cuando aplique)",
    ],
  },
  {
    id: 4,
    titulo: "Subasta de Departamento en Capital",
    descripcion: "Departamento de 2 ambientes, ubicado en pleno centro de Mendoza.",
    descripcionCompleta: "Departamento de 2 ambientes a estrenar ubicado en edificio de categoría en pleno centro de Mendoza. Cuenta con living-comedor, dormitorio, cocina integrada, baño completo y balcón con vista a la calle. El edificio posee seguridad 24 hs, cochera opcional y sum. Ideal para inversión o vivienda.",
    categoria: "inmuebles",
    fecha: "5 de Enero, 2026",
    hora: "10:00 hs",
    lugar: "Sede del Colegio - Av. San Martín 1234",
    direccion: "Av. San Martín 1234, Ciudad de Mendoza",
    martillero: "Roberto Martínez",
    matricula: "M-0005",
    telefono: "(261) 428-3456",
    email: "rmartinez@martilleros.com",
    baseMinima: "$35.000.000",
    estado: "realizada",
    superficie: "52 m²",
    ambientes: 2,
    cochera: false,
    patio: false,
    antiguedad: "A estrenar",
    imagenes: [
      { id: 1, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", alt: "Living del departamento" },
      { id: 2, url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop", alt: "Dormitorio" },
      { id: 3, url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop", alt: "Cocina integrada" },
      { id: 4, url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop", alt: "Baño" },
    ],
    productos: [
      { id: 1, nombre: "Departamento 2 ambientes", descripcion: "Unidad funcional completa", valorEstimado: "$35.000.000" },
    ],
    condiciones: [
      "Seña del 10% al momento de la adjudicación",
      "Saldo en 30 días corridos",
      "Escritura a cargo del comprador",
      "Comisión del martillero: 3% + IVA",
    ],
    documentacion: [
      "Título de propiedad",
      "Reglamento de copropiedad",
      "Planos aprobados",
      "Libre deuda de expensas",
    ],
  },
]

export function getSubastaById(id: number): Subasta | undefined {
  return subastas.find(s => s.id === id)
}

export function getSubastasByCategoria(categoria: string): Subasta[] {
  if (categoria === "todas") return subastas
  return subastas.filter(s => s.categoria === categoria)
}
