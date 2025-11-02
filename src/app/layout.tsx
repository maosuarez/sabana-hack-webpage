import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { AlertsProvider } from "@/lib/hooks/use-alerts"
import { WhatsAppButton } from "@/components/whatsapp-button"

const inter = Inter({ subsets: ["latin"] })
const robotoMono = Roboto_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cruz Roja Colombiana - Sistema de Gestión de Emergencias",
  description: "Plataforma de prevención y gestión de riesgos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AlertsProvider>
            {children}
            <WhatsAppButton />
          </AlertsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
