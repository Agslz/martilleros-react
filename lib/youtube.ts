/** Extrae ID de video y arma URL de embed a partir de links YouTube comunes. */
export function youtubeEmbedUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null
  const url = raw.trim()

  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "").toLowerCase()

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      const v = u.searchParams.get("v")
      if (v) return `https://www.youtube.com/embed/${v}`
    }
  } catch {
    // no es URL válida
  }

  // Fallback: ID crudo de 11 caracteres
  if (/^[\w-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}`
  }
  return null
}
