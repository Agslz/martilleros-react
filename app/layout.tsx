import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { getSiteUrl } from "@/lib/site"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });

const siteUrl = getSiteUrl()
const defaultDescription =
  "Institución oficial de Mendoza. Registro de matriculados, búsqueda de martilleros habilitados, edictos y subastas públicas, trámites e información de contacto."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    template: "%s | Colegio de Martilleros de Mendoza",
  },
  description: defaultDescription,
  applicationName: "Colegio de Martilleros de Mendoza",
  category: "government",
  authors: { name: "Colegio de Martilleros de Mendoza" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Colegio de Martilleros de Mendoza",
    title: "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    description: defaultDescription,
    images: [
      {
        url: "/images/primera-comision-martilleros.png",
        width: 1200,
        height: 630,
        alt: "Primera comisión del Colegio de Martilleros de Mendoza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza",
    description: defaultDescription,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR">
      <body className={`font-sans antialiased`}>
        <SiteJsonLd />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
