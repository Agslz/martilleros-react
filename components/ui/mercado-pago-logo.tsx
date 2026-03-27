"use client"

import Image from "next/image"

interface MercadoPagoLogoProps {
  className?: string
  height?: number
  width?: number
}

/**
 * Logo de Mercado Pago para la sección de cuotas.
 * Usa el PNG en public/MercadoPagoLogo.png (origen: assets/MercadoPagoLogo.png).
 */
export function MercadoPagoLogo({ className, height = 32, width }: MercadoPagoLogoProps) {
  const w = width ?? height * 2
  return (
    <Image
      src="/MercadoPagoLogo.png"
      alt="Mercado Pago"
      width={w}
      height={height}
      className={className}
      unoptimized
    />
  )
}
