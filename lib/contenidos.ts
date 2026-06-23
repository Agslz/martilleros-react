import type { ContenidoResponse } from "@/lib/api/types"

export interface HomeBloque {
  titulo: string
  cuerpo: string
}

export interface HomeContenidoData {
  intro: HomeBloque
  sobre: HomeBloque
}

export interface ContactoContenidoData {
  telefono: string
  correo: string
  direccion: string
}

const DEFAULT_HOME: HomeContenidoData = {
  intro: {
    titulo:
      "Conoce a la primera comisión del Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    cuerpo:
      "Luego de muchos años de trabajo y gestión, se constituyó la nueva comisión: un paso decisivo que renueva el liderazgo colegial y refuerza nuestro compromiso con la transparencia, la legalidad y el acompañamiento a matriculados y ciudadanía.",
  },
  sobre: {
    titulo: "Más de 50 años regulando la profesión en Mendoza",
    cuerpo:
      "El Colegio de Martilleros y Corredores Públicos de Mendoza es la institución encargada de regular, supervisar y promover el ejercicio ético y profesional de martilleros y corredores en toda la provincia.\n\nNuestra misión es garantizar que todos los profesionales matriculados cumplan con los más altos estándares de calidad, transparencia y legalidad en cada operación que realizan.",
  },
}

const DEFAULT_CONTACTO: ContactoContenidoData = {
  telefono: "2617570100",
  correo: "colegiomartilleros.1916@gmail.com",
  direccion: "Mendoza, Argentina",
}

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function isHomeContenidoData(value: unknown): value is HomeContenidoData {
  if (!value || typeof value !== "object") return false
  const v = value as HomeContenidoData
  return (
    typeof v.intro?.titulo === "string" &&
    typeof v.intro?.cuerpo === "string" &&
    typeof v.sobre?.titulo === "string" &&
    typeof v.sobre?.cuerpo === "string"
  )
}

function isContactoContenidoData(value: unknown): value is ContactoContenidoData {
  if (!value || typeof value !== "object") return false
  const v = value as ContactoContenidoData
  return (
    typeof v.telefono === "string" &&
    typeof v.correo === "string" &&
    typeof v.direccion === "string"
  )
}

export function parseHomeContenido(
  contenido?: ContenidoResponse | null
): HomeContenidoData {
  if (!contenido?.cuerpo?.trim()) return DEFAULT_HOME

  const fromJson = parseJson<HomeContenidoData>(contenido.cuerpo.trim())
  if (fromJson && isHomeContenidoData(fromJson)) return fromJson

  return {
    intro: {
      titulo: contenido.titulo?.trim() || DEFAULT_HOME.intro.titulo,
      cuerpo: contenido.cuerpo.trim() || DEFAULT_HOME.intro.cuerpo,
    },
    sobre: DEFAULT_HOME.sobre,
  }
}

export function serializeHomeContenido(data: HomeContenidoData): {
  titulo: string
  cuerpo: string
} {
  return {
    titulo: data.intro.titulo.trim(),
    cuerpo: JSON.stringify(data),
  }
}

export function parseContactoContenido(
  contenido?: ContenidoResponse | null
): ContactoContenidoData {
  if (!contenido?.cuerpo?.trim()) return DEFAULT_CONTACTO

  const fromJson = parseJson<ContactoContenidoData>(contenido.cuerpo.trim())
  if (fromJson && isContactoContenidoData(fromJson)) return fromJson

  return DEFAULT_CONTACTO
}

export function serializeContactoContenido(data: ContactoContenidoData): {
  titulo: string
  cuerpo: string
} {
  return {
    titulo: "Contacto",
    cuerpo: JSON.stringify({
      telefono: data.telefono.trim(),
      correo: data.correo.trim(),
      direccion: data.direccion.trim(),
    }),
  }
}

export function googleMapsSearchUrl(direccion: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
}

export function googleMapsEmbedUrl(direccion: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&z=15&output=embed`
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}
