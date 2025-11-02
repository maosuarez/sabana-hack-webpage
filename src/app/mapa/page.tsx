"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Users, Route } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const InteractiveMap = dynamic(() => import("@/components/interactive-map").then((mod) => mod.InteractiveMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-muted">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E30613] border-t-transparent mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  ),
})

export default function MapaPage() {
  const [selectedLayer, setSelectedLayer] = useState<string>("risk-zones")
  const [riskZones, setRiskZones] = useState<any[]>([])
  const [meetingPoints, setMeetingPoints] = useState<any[]>([])
  const [evacuationRoutes, setEvacuationRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const [zonesRes, pointsRes, routesRes] = await Promise.all([
          fetch("/api/map/zones"),
          fetch("/api/map/meeting-points"),
          fetch("/api/map/evacuation-routes"),
        ])

        if (zonesRes.ok) {
          const data = await zonesRes.json()
          setRiskZones(data.zones || [])
        }

        if (pointsRes.ok) {
          const data = await pointsRes.json()
          setMeetingPoints(data.points || [])
        }

        if (routesRes.ok) {
          const data = await routesRes.json()
          setEvacuationRoutes(data.routes || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching map data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMapData()
  }, [])

  const layers = [
    { id: "risk-zones", label: "Zonas de Riesgo", icon: AlertTriangle },
    { id: "meeting-points", label: "Puntos de Encuentro", icon: Users },
    { id: "evacuation-routes", label: "Rutas de Evacuación", icon: Route },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1" role="main">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                <MapPin className="h-6 w-6 text-[#E30613]" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-balance">Mapa Interactivo de Riesgos</h1>
                <p className="text-muted-foreground text-pretty">
                  Visualiza zonas de riesgo, puntos de encuentro y rutas de evacuación
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* Map */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Mapa de Soacha
                        </CardTitle>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              {layers.find((l) => l.id === selectedLayer)?.label || "Seleccionar capa"}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Capas disponibles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={selectedLayer}
                              onValueChange={(value) => setSelectedLayer(value)}
                            >
                              {layers.map((layer) => (
                                <DropdownMenuRadioItem key={layer.id} value={layer.id}>
                                  <div className="flex items-center gap-2">
                                    <layer.icon className="h-4 w-4" />
                                    {layer.label}
                                  </div>
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-muted">
                        <div className="text-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E30613] border-t-transparent mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Cargando datos del mapa...</p>
                        </div>
                      </div>
                    ) : (
                      <InteractiveMap
                        selectedLayer={selectedLayer}
                        riskZones={riskZones}
                        meetingPoints={meetingPoints}
                        evacuationRoutes={evacuationRoutes}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leyenda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-red-600" aria-hidden="true" />
                        <span className="text-sm">Riesgo Crítico/Alto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-orange-500" aria-hidden="true" />
                        <span className="text-sm">Riesgo Medio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" aria-hidden="true" />
                        <span className="text-sm">Riesgo Bajo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" aria-hidden="true" />
                        <span className="text-sm">Zona Segura</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Tabs defaultValue="zones" className="w-full">
                  <TabsList className="grid w-full grid-cols-3" role="tablist">
                    <TabsTrigger value="zones">Zonas</TabsTrigger>
                    <TabsTrigger value="points">Puntos</TabsTrigger>
                    <TabsTrigger value="routes">Rutas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="zones" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Zonas de Riesgo</CardTitle>
                        <CardDescription>Áreas identificadas con diferentes niveles de riesgo</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {riskZones.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No hay zonas de riesgo registradas
                          </p>
                        ) : (
                          riskZones.map((zone, index) => (
                            <div
                              key={zone._id?.toString() || index}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{zone.name}</span>
                                  <Badge
                                    variant={
                                      zone.level === "high" || zone.level === "critical"
                                        ? "destructive"
                                        : zone.level === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {zone.level === "critical"
                                      ? "Crítico"
                                      : zone.level === "high"
                                        ? "Alto"
                                        : zone.level === "medium"
                                          ? "Medio"
                                          : "Bajo"}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {zone.incidents || 0} incidentes • {zone.population?.toLocaleString()} hab.
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="points" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Puntos de Encuentro</CardTitle>
                        <CardDescription>Lugares seguros designados para evacuación</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {meetingPoints.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No hay puntos de encuentro registrados
                          </p>
                        ) : (
                          meetingPoints.map((point, index) => (
                            <div
                              key={point._id?.toString() || index}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{point.name}</span>
                                  <Badge variant="outline" className="capitalize">
                                    {point.type}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Capacidad: {point.capacity?.toLocaleString()} personas
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="routes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Rutas de Evacuación</CardTitle>
                        <CardDescription>Caminos seguros para evacuación de emergencia</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {evacuationRoutes.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No hay rutas de evacuación registradas
                          </p>
                        ) : (
                          evacuationRoutes.map((route, index) => (
                            <div
                              key={route._id?.toString() || index}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{route.name}</span>
                                  <Badge
                                    variant={
                                      route.difficulty === "easy"
                                        ? "secondary"
                                        : route.difficulty === "moderate"
                                          ? "default"
                                          : "destructive"
                                    }
                                  >
                                    {route.difficulty === "easy"
                                      ? "Fácil"
                                      : route.difficulty === "moderate"
                                        ? "Moderada"
                                        : "Difícil"}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {(route.distance / 1000).toFixed(2)} km • {route.estimatedTime} min
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full bg-[#E30613] hover:bg-[#B30510]" asChild>
                      <a href="/alertas">
                        <AlertTriangle className="mr-2 h-4 w-4" aria-hidden="true" />
                        Reportar Incidente
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="mr-2 h-4 w-4" aria-hidden="true" />
                      Encontrar Ruta Segura
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
