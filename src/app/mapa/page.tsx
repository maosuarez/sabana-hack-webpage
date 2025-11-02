"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Users, Route, Flame } from "lucide-react"
import { InteractiveMap } from "@/components/interactive-map"
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

export default function MapaPage() {
  const [selectedLayer, setSelectedLayer] = useState<string>("risk-zones")

  const layers = [
    { id: "risk-zones", label: "Zonas de Riesgo", icon: AlertTriangle },
    { id: "heat-map", label: "Mapa de Calor", icon: Flame },
    { id: "meeting-points", label: "Puntos de Encuentro", icon: Users },
    { id: "evacuation-routes", label: "Rutas de Evacuación", icon: Route },
  ]

  const riskZones = [
    { name: "Zona Norte", level: "high", incidents: 12, population: 45000 },
    { name: "Zona Centro", level: "medium", incidents: 7, population: 78000 },
    { name: "Zona Sur", level: "low", incidents: 3, population: 32000 },
    { name: "Zona Este", level: "high", incidents: 15, population: 56000 },
  ]

  const meetingPoints = [
    { name: "Parque Central", capacity: 5000, type: "Primario" },
    { name: "Estadio Municipal", capacity: 15000, type: "Primario" },
    { name: "Plaza de Mercado", capacity: 3000, type: "Secundario" },
    { name: "Centro Comercial", capacity: 8000, type: "Secundario" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                <MapPin className="h-6 w-6 text-[#E30613]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Mapa Interactivo de Riesgos</h1>
                <p className="text-muted-foreground">
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
                    <InteractiveMap selectedLayer={selectedLayer} />
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
                        <div className="h-4 w-4 rounded-full bg-red-500" />
                        <span className="text-sm">Riesgo Alto</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-orange-500" />
                        <span className="text-sm">Riesgo Medio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        <span className="text-sm">Riesgo Bajo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                        <span className="text-sm">Zona Segura</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Tabs defaultValue="zones" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="zones">Zonas</TabsTrigger>
                    <TabsTrigger value="points">Puntos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="zones" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Zonas de Riesgo</CardTitle>
                        <CardDescription>Áreas identificadas con diferentes niveles de riesgo</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {riskZones.map((zone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{zone.name}</span>
                                <Badge
                                  variant={
                                    zone.level === "high"
                                      ? "destructive"
                                      : zone.level === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {zone.level === "high" ? "Alto" : zone.level === "medium" ? "Medio" : "Bajo"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {zone.incidents} incidentes • {zone.population.toLocaleString()} hab.
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
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
                        {meetingPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{point.name}</span>
                                <Badge variant="outline">{point.type}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Capacidad: {point.capacity.toLocaleString()} personas
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
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
                    <Button className="w-full bg-[#E30613] hover:bg-[#B30510]">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reportar Incidente
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Navigation className="mr-2 h-4 w-4" />
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
