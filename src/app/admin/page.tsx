"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, MapPin, GraduationCap, BarChart3, Users, Settings, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E30613] border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const adminSections = [
    {
      title: "Gestión de Mapas",
      description: "Administrar zonas de riesgo, puntos de encuentro y rutas de evacuación",
      icon: MapPin,
      href: "/admin/mapa",
      color: "text-[#E30613]",
      bgColor: "bg-[#E30613]/10",
    },
    {
      title: "Gestión de Capacitación",
      description: "Administrar cursos, videos y recursos educativos",
      icon: GraduationCap,
      href: "/admin/capacitacion",
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Gestión de Dashboard",
      description: "Configurar métricas, reportes y visualizaciones",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Gestión de Alertas",
      description: "Administrar alertas activas y asignaciones",
      icon: AlertTriangle,
      href: "/admin/alertas",
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios, roles y permisos",
      icon: Users,
      href: "/admin/usuarios",
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      title: "Configuración",
      description: "Ajustes generales del sistema",
      icon: Settings,
      href: "/admin/configuracion",
      color: "text-gray-600",
      bgColor: "bg-gray-600/10",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1" role="main">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                <Shield className="h-6 w-6 text-[#E30613]" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">Gestión completa del sistema de emergencias</p>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Sections */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminSections.map((section, index) => (
                <Card key={index} className="group transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${section.bgColor}`}>
                      <section.icon className={`h-6 w-6 ${section.color}`} aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full group-hover:bg-muted bg-transparent">
                      <Link href={section.href}>
                        Administrar
                        <span className="ml-2" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Estadísticas Rápidas</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cursos Publicados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground mt-1">8 en borrador</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Zonas de Riesgo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">67</div>
                  <p className="text-xs text-muted-foreground mt-1">15 de alto riesgo</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
