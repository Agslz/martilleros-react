/** Extrae el ID de video de links YouTube comunes (watch, youtu.be, shorts, embed). */
export function youtubeVideoId(raw?: string | null): string | null {
  if (!raw?.trim()) return null
  const url = raw.trim()

  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "").toLowerCase()

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]
      return id || null
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] || null
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || null
      }
      return u.searchParams.get("v")
    }
  } catch {
    // no es URL válida
  }

  if (/^[\w-]{11}$/.test(url)) return url
  return null
}

/** URL de embed para iframe. */
export function youtubeEmbedUrl(raw?: string | null): string | null {
  const id = youtubeVideoId(raw)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

/** Miniatura pública de YouTube (hqdefault). */
export function youtubeThumbnailUrl(raw?: string | null): string | null {
  const id = youtubeVideoId(raw)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
