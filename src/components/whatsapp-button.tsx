"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WhatsAppButton() {
  const whatsappNumber = "573001234567" // Replace with actual Cruz Roja WhatsApp number
  const message = "Hola, necesito ayuda con información de la Cruz Roja Colombiana"

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] p-0 shadow-lg hover:bg-[#20BA5A] hover:shadow-xl transition-all duration-300"
      aria-label="Contactar por WhatsApp para soporte"
      title="Chatea con nosotros en WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
      <span className="sr-only">Contactar por WhatsApp</span>
    </Button>
  )
}
