/**
 * URL pública del sitio (canónicas, OG, sitemap, JSON-LD).
 * En producción definir NEXT_PUBLIC_SITE_URL (ej. https://www.colemendoza.org.ar)
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "")
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
  }
  return "http://localhost:3000"
}
