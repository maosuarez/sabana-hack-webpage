"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Shield } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/mapa", label: "Mapa de Riesgos" },
    { href: "/capacitacion", label: "Capacitación" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/alertas", label: "Alertas" },
  ]

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      aria-label="Navegación principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Cruz Roja Colombiana - Ir a inicio">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E30613]" aria-hidden="true">
              <span className="text-xl font-bold text-white">+</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight text-[#E30613]">Cruz Roja</span>
              <span className="text-xs leading-tight text-muted-foreground">Colombiana</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex" role="navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-[#E30613] focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 rounded-sm px-2 py-1 ${
                  pathname === item.href ? "text-[#E30613]" : "text-muted-foreground"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2" aria-label={`Menú de usuario: ${user.name}`}>
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                    {user.email}
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-[#E30613] hover:bg-[#B30510] focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2"
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" aria-label="Menú de navegación móvil">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
