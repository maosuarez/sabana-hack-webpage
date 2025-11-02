import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E30613]">
                <span className="text-xl font-bold text-white">+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight text-[#E30613]">Cruz Roja</span>
                <span className="text-xs leading-tight text-muted-foreground">Colombiana</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Trabajando por la prevención y atención de emergencias en Colombia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mapa" className="text-muted-foreground transition-colors hover:text-[#E30613]">
                  Mapa de Riesgos
                </Link>
              </li>
              <li>
                <Link href="/capacitacion" className="text-muted-foreground transition-colors hover:text-[#E30613]">
                  Capacitación
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-[#E30613]">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/alertas" className="text-muted-foreground transition-colors hover:text-[#E30613]">
                  Alertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Línea Nacional: 01 8000 123 123</li>
              <li>Email: info@cruzroja.org.co</li>
              <li>Bogotá, Colombia</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Síguenos</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#E30613] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#E30613] hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#E30613] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-[#E30613] hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Cruz Roja Colombiana. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
