import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, GraduationCap, BarChart3, Bell, Shield, Users, Heart, AlertTriangle } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: "Mapa de Riesgos",
      description:
        "Visualiza zonas de riesgo, mapas de calor, puntos de encuentro y rutas de evacuación en tiempo real.",
      href: "/mapa",
      color: "text-[#E30613]",
    },
    {
      icon: GraduationCap,
      title: "Capacitación",
      description: "Accede a videos educativos, cursos y material de entrenamiento para la prevención de riesgos.",
      href: "/capacitacion",
      color: "text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Monitorea datos en tiempo real con visualizaciones interactivas y reportes detallados.",
      href: "/dashboard",
      color: "text-green-600",
    },
    {
      icon: Bell,
      title: "Sistema de Alertas",
      description: "Recibe notificaciones instantáneas sobre emergencias y situaciones de riesgo en tu zona.",
      href: "/alertas",
      color: "text-orange-600",
    },
  ]

  const stats = [
    { icon: Shield, value: "24/7", label: "Monitoreo Continuo" },
    { icon: Users, value: "1000+", label: "Voluntarios Activos" },
    { icon: Heart, value: "50K+", label: "Personas Ayudadas" },
    { icon: AlertTriangle, value: "99.9%", label: "Tiempo de Respuesta" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#E30613] via-[#B30510] to-[#8B0410] py-20 text-white">
          <div className="absolute inset-0 bg-[url('/abstract-red-pattern.png')] opacity-10" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Sistema de Gestión de Emergencias
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl">
                Plataforma integral para la prevención, monitoreo y respuesta ante situaciones de riesgo en Colombia
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-[#E30613] hover:bg-white/90">
                  <Link href="/mapa">Explorar Mapa</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/capacitacion">Ver Capacitaciones</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                    <stat.icon className="h-6 w-6 text-[#E30613]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Nuestras Herramientas</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Accede a todas las funcionalidades de nuestra plataforma para estar preparado ante cualquier emergencia
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="group transition-all hover:shadow-lg">
                  <CardHeader>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full group-hover:bg-muted">
                      <Link href={feature.href}>
                        Acceder
                        <span className="ml-2">→</span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">¿Necesitas Ayuda Inmediata?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Nuestro equipo está disponible 24/7 para atender cualquier emergencia
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-[#E30613] hover:bg-[#B30510]">
                  <Link href="/alertas">Reportar Emergencia</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="tel:018000123123">Llamar: 01 8000 123 123</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
