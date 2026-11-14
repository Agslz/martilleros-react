import QRCode from "qrcode"

/** URL pública que abre el cartel de verificación de cuota al escanear el QR. */
export function urlVerificacionCuota(matriculadoId: number): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "http://localhost:3000"
  return `${origin}/verificar/${matriculadoId}`
}

export async function generarQrPngDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: { dark: "#000000", light: "#ffffff" },
  })
}

export function descargarDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function descargarQrMatriculado(opts: {
  id: number
  matricula: string
  apellido: string
}): Promise<void> {
  const url = urlVerificacionCuota(opts.id)
  const dataUrl = await generarQrPngDataUrl(url)
  const safeMat = opts.matricula.replace(/[^\w.-]+/g, "_")
  const safeApe = opts.apellido.replace(/[^\w.-]+/g, "_")
  descargarDataUrl(dataUrl, `qr-${safeMat}-${safeApe}.png`)
}
