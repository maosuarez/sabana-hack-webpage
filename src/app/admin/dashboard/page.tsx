"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Settings, Database, RefreshCw } from "lucide-react"

export default function AdminDashboardPage() {
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
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-[#E30613] border-t-transparent mx-auto mb-4"
            aria-label="Cargando"
          />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1" role="main">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/10">
                  <BarChart3 className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Gestión de Dashboard</h1>
                  <p className="text-muted-foreground">Configurar métricas y visualizaciones</p>
                </div>
              </div>
              <Button asChild variant="outline">
                <a href="/admin">← Volver al Panel</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" aria-hidden="true" />
                  Configuración de Power BI
                </CardTitle>
                <CardDescription>Configure la URL de integración de Power BI Embedded</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="powerbi-url">URL de Power BI Embedded</Label>
                  <Input
                    id="powerbi-url"
                    placeholder="https://app.powerbi.com/view?r=..."
                    defaultValue={process.env.NEXT_PUBLIC_POWERBI_EMBED_URL || ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta URL se mostrará en el dashboard público. Configure la variable de entorno POWERBI_EMBED_URL.
                  </p>
                </div>
                <Button className="bg-[#E30613] hover:bg-[#B30510]">Guardar Configuración</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" aria-hidden="true" />
                  Actualización de Datos
                </CardTitle>
                <CardDescription>Gestionar la actualización de métricas y estadísticas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Frecuencia de Actualización</Label>
                    <p className="text-sm text-muted-foreground">Actualmente: Cada 5 segundos</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Última Actualización</Label>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleString("es-CO")}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Actualizar Datos Ahora
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Disponibles</CardTitle>
                <CardDescription>Estadísticas que se muestran en el dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Alertas Activas</span>
                    <span className="text-sm text-muted-foreground">Habilitado</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Total Incidentes</span>
                    <span className="text-sm text-muted-foreground">Habilitado</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Voluntarios Activos</span>
                    <span className="text-sm text-muted-foreground">Habilitado</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium">Personas Ayudadas</span>
                    <span className="text-sm text-muted-foreground">Habilitado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
