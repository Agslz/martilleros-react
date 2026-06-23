import Link from "next/link"
import Image from "next/image"

const WHATSAPP_URL = "https://wa.me/2617570100"

export function WhatsAppFab() {
  return (
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
}
