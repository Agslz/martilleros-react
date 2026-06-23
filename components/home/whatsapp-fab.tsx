"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const WHATSAPP_URL = "https://wa.me/2617570100"

function usePointerHover() {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHover(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return canHover
}

export function WhatsAppFab() {
  const canHover = usePointerHover()

  const button = (
    <Link
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      aria-label="Contactar por WhatsApp"
    >
      <Image
        src="/images/whatsapp-icon.png"
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 object-cover"
        aria-hidden
      />
    </Link>
  )

  if (!canHover) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        Contactar por wsp
      </TooltipContent>
    </Tooltip>
  )
}
