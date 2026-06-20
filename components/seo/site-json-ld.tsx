import { getSiteUrl } from "@/lib/site"

const ORG_NAME =
  "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza"
const ORG_DESC =
  "Institución oficial que regula y supervisa el ejercicio profesional de martilleros y corredores públicos en la provincia de Mendoza, Argentina."

export function SiteJsonLd() {
  const siteUrl = getSiteUrl()
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    description: ORG_DESC,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
  }
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG_NAME,
    url: siteUrl,
    description: ORG_DESC,
    publisher: { "@type": "Organization", name: ORG_NAME, url: siteUrl },
  }
  const payload = JSON.stringify([org, website])
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  )
}
