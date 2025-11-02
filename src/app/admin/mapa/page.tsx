"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminMapaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [riskZones, setRiskZones] = useState<any[]>([])
  const [meetingPoints, setMeetingPoints] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Fetch risk zones and meeting points
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [zonesRes, pointsRes] = await Promise.all([fetch("/api/map/zones"), fetch("/api/map/meeting-points")])

      if (zonesRes.ok) {
        const zonesData = await zonesRes.json()
        setRiskZones(zonesData.zones || [])
      }

      if (pointsRes.ok) {
        const pointsData = await pointsRes.json()
        setMeetingPoints(pointsData.points || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching map data:", error)
    }
  }

  const handleCreateZone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newZone = {
      name: formData.get("name"),
      level: formData.get("level"),
      type: formData.get("type"),
      coordinates: {
        lat: Number.parseFloat(formData.get("lat") as string),
        lng: Number.parseFloat(formData.get("lng") as string),
      },
      radius: Number.parseInt(formData.get("radius") as string),
      population: Number.parseInt(formData.get("population") as string),
      description: formData.get("description"),
    }

    try {
      const response = await fetch("/api/map/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchData()
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error("[v0] Error creating zone:", error)
    }
  }

  const handleDeleteZone = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta zona de riesgo?")) return

    try {
      const response = await fetch(`/api/map/zones/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("[v0] Error deleting zone:", error)
    }
  }

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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                  <MapPin className="h-6 w-6 text-[#E30613]" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Gestión de Mapas</h1>
                  <p className="text-muted-foreground">Administrar zonas de riesgo y puntos de encuentro</p>
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
          <div className="container mx-auto px-4">
            <Tabs defaultValue="zones" className="w-full">
              <TabsList>
                <TabsTrigger value="zones">Zonas de Riesgo</TabsTrigger>
                <TabsTrigger value="points">Puntos de Encuentro</TabsTrigger>
              </TabsList>

              <TabsContent value="zones" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Zonas de Riesgo</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E30613] hover:bg-[#B30510]">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Nueva Zona
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-w-2xl max-h-[90vh] overflow-y-auto"
                      aria-labelledby="dialog-title"
                      aria-describedby="dialog-description"
                    >
                      <DialogHeader>
                        <DialogTitle id="dialog-title">Crear Nueva Zona de Riesgo</DialogTitle>
                        <DialogDescription id="dialog-description">
                          Complete los datos para registrar una nueva zona de riesgo
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateZone} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Zona *</Label>
                            <Input id="name" name="name" required placeholder="Ej: Zona Norte - Barrio Popular" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="level">Nivel de Riesgo *</Label>
                            <Select name="level" required>
                              <SelectTrigger id="level">
                                <SelectValue placeholder="Seleccionar nivel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Bajo</SelectItem>
                                <SelectItem value="medium">Medio</SelectItem>
                                <SelectItem value="high">Alto</SelectItem>
                                <SelectItem value="critical">Crítico</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Riesgo *</Label>
                            <Select name="type" required>
                              <SelectTrigger id="type">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="flood">Inundación</SelectItem>
                                <SelectItem value="earthquake">Terremoto</SelectItem>
                                <SelectItem value="fire">Incendio</SelectItem>
                                <SelectItem value="landslide">Deslizamiento</SelectItem>
                                <SelectItem value="multiple">Múltiple</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="population">Población Afectada *</Label>
                            <Input id="population" name="population" type="number" required placeholder="Ej: 45000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lat">Latitud *</Label>
                            <Input id="lat" name="lat" type="number" step="any" required placeholder="Ej: 4.7110" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lng">Longitud *</Label>
                            <Input id="lng" name="lng" type="number" step="any" required placeholder="Ej: -74.0721" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="radius">Radio (metros) *</Label>
                            <Input id="radius" name="radius" type="number" required placeholder="Ej: 2000" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Descripción detallada de la zona de riesgo..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" className="bg-[#E30613] hover:bg-[#B30510]">
                            Crear Zona
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {riskZones.map((zone) => (
                    <Card key={zone._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{zone.name}</CardTitle>
                            <CardDescription className="mt-1">{zone.description}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              zone.level === "critical" || zone.level === "high"
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
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="font-medium capitalize">{zone.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Población:</span>
                            <span className="font-medium">{zone.population?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Radio:</span>
                            <span className="font-medium">{zone.radius}m</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteZone(zone._id?.toString())}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Eliminar zona</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="points" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Puntos de Encuentro</h2>
                  <Button className="bg-[#E30613] hover:bg-[#B30510]">
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Nuevo Punto
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {meetingPoints.map((point) => (
                    <Card key={point._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{point.name}</CardTitle>
                            <CardDescription className="mt-1">{point.address}</CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {point.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span>Capacidad: {point.capacity?.toLocaleString()} personas</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estado:</span>
                            <Badge variant={point.status === "active" ? "default" : "secondary"} className="text-xs">
                              {point.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Eliminar punto</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
