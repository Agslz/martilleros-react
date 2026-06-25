import type { MetadataRoute } from "next"
import { getSubastasPublicas } from "@/lib/api/subastas"
import { getFechasBoletin } from "@/lib/subasta-display"
import { getSiteUrl } from "@/lib/site"

export const revalidate = 3600

const staticPaths: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/buscar", changeFrequency: "monthly", priority: 0.9 },
  { path: "/matriculados", changeFrequency: "weekly", priority: 0.9 },
  { path: "/edictos", changeFrequency: "daily", priority: 0.9 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()
  const entries: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "" ? `${base}/` : `${base}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  )

  try {
    const subastas = await getSubastasPublicas()
    for (const s of subastas) {
      const fechasBo = getFechasBoletin(s)
      const lastBo = fechasBo.length > 0 ? fechasBo[fechasBo.length - 1] : null
      entries.push({
        url: `${base}/edictos/${s.id}`,
        lastModified: s.fechaPublicacion
          ? new Date(s.fechaPublicacion)
          : lastBo
            ? new Date(lastBo)
            : s.fechaInicio
              ? new Date(s.fechaInicio)
              : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })
    }
  } catch {
    // API no disponible en build o entorno local: sitemap con rutas estáticas solamente
  }

  return entries
}
