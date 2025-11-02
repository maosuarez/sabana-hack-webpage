"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
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

const InteractiveMap = dynamic(() => import("@/components/interactive-map").then((mod) => mod.InteractiveMap), {
  ssr: false,
})

export default function AdminMapaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [riskZones, setRiskZones] = useState<any[]>([])
  const [meetingPoints, setMeetingPoints] = useState<any[]>([])
  const [evacuationRoutes, setEvacuationRoutes] = useState<any[]>([])
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false)
  const [isPointDialogOpen, setIsPointDialogOpen] = useState(false)
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [zonesRes, pointsRes, routesRes] = await Promise.all([
        fetch("/api/map/zones"),
        fetch("/api/map/meeting-points"),
        fetch("/api/map/evacuation-routes"),
      ])

      if (zonesRes.ok) {
        const zonesData = await zonesRes.json()
        setRiskZones(zonesData.zones || [])
      }

      if (pointsRes.ok) {
        const pointsData = await pointsRes.json()
        setMeetingPoints(pointsData.points || [])
      }

      if (routesRes.ok) {
        const routesData = await routesRes.json()
        setEvacuationRoutes(routesData.routes || [])
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
      incidents: 0,
      description: formData.get("description"),
    }

    try {
      const response = await fetch("/api/map/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      })

      if (response.ok) {
        setIsZoneDialogOpen(false)
        fetchData()
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error("[v0] Error creating zone:", error)
    }
  }

  const handleCreatePoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newPoint = {
      name: formData.get("name"),
      type: formData.get("type"),
      address: formData.get("address"),
      coordinates: {
        lat: Number.parseFloat(formData.get("lat") as string),
        lng: Number.parseFloat(formData.get("lng") as string),
      },
      capacity: Number.parseInt(formData.get("capacity") as string),
      facilities: (formData.get("facilities") as string).split(",").map((f) => f.trim()),
      accessibility: formData.get("accessibility") === "true",
      contact: {
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
      },
      status: formData.get("status"),
    }

    try {
      const response = await fetch("/api/map/meeting-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoint),
      })

      if (response.ok) {
        setIsPointDialogOpen(false)
        fetchData()
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error("[v0] Error creating meeting point:", error)
    }
  }

  const handleCreateRoute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Parse coordinates from textarea (format: lat,lng per line)
    const coordsText = formData.get("coordinates") as string
    const coordinates = coordsText
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => {
        const [lat, lng] = line.split(",").map((n) => Number.parseFloat(n.trim()))
        return { lat, lng, order: index }
      })

    const newRoute = {
      name: formData.get("name"),
      description: formData.get("description"),
      coordinates,
      startPoint: {
        name: formData.get("startName") as string,
        lat: coordinates[0].lat,
        lng: coordinates[0].lng,
      },
      endPoint: {
        name: formData.get("endName") as string,
        lat: coordinates[coordinates.length - 1].lat,
        lng: coordinates[coordinates.length - 1].lng,
      },
      distance: Number.parseInt(formData.get("distance") as string),
      estimatedTime: Number.parseInt(formData.get("estimatedTime") as string),
      difficulty: formData.get("difficulty"),
      status: formData.get("status"),
      accessibility: formData.get("accessibility") === "true",
      warnings: (formData.get("warnings") as string)
        .split(",")
        .map((w) => w.trim())
        .filter((w) => w),
    }

    try {
      const response = await fetch("/api/map/evacuation-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoute),
      })

      if (response.ok) {
        setIsRouteDialogOpen(false)
        fetchData()
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error("[v0] Error creating evacuation route:", error)
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

  const handleDeletePoint = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este punto de encuentro?")) return

    try {
      const response = await fetch(`/api/map/meeting-points/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("[v0] Error deleting meeting point:", error)
    }
  }

  const handleDeleteRoute = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta ruta de evacuación?")) return

    try {
      const response = await fetch(`/api/map/evacuation-routes/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("[v0] Error deleting evacuation route:", error)
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
                  <p className="text-muted-foreground">Administrar zonas de riesgo, puntos de encuentro y rutas</p>
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
                <TabsTrigger value="routes">Rutas de Evacuación</TabsTrigger>
              </TabsList>

              {/* ZONES TAB */}
              <TabsContent value="zones" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Zonas de Riesgo</h2>
                  <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E30613] hover:bg-[#B30510]">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Nueva Zona
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Crear Nueva Zona de Riesgo</DialogTitle>
                        <DialogDescription>
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
                          <Button type="button" variant="outline" onClick={() => setIsZoneDialogOpen(false)}>
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

              {/* POINTS TAB */}
              <TabsContent value="points" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Puntos de Encuentro</h2>
                  <Dialog open={isPointDialogOpen} onOpenChange={setIsPointDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E30613] hover:bg-[#B30510]">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Nuevo Punto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Punto de Encuentro</DialogTitle>
                        <DialogDescription>
                          Complete los datos para registrar un nuevo punto de encuentro
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreatePoint} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Punto *</Label>
                            <Input id="name" name="name" required placeholder="Ej: Parque Central" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Punto *</Label>
                            <Select name="type" required>
                              <SelectTrigger id="type">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="shelter">Refugio</SelectItem>
                                <SelectItem value="hospital">Hospital</SelectItem>
                                <SelectItem value="school">Escuela</SelectItem>
                                <SelectItem value="community-center">Centro Comunitario</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Dirección *</Label>
                            <Input id="address" name="address" required placeholder="Ej: Calle 123, Ciudad" />
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
                            <Label htmlFor="capacity">Capacidad (personas) *</Label>
                            <Input id="capacity" name="capacity" type="number" required placeholder="Ej: 500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="facilities">Facilidades (separadas por comas)</Label>
                            <Input id="facilities" name="facilities" placeholder="Ej: Aire acondicionado, Wi-Fi" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accessibility">Accesible *</Label>
                            <Select name="accessibility" required>
                              <SelectTrigger id="accessibility">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sí</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono de Contacto *</Label>
                            <Input id="phone" name="phone" required placeholder="Ej: +57 123456789" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico de Contacto *</Label>
                            <Input id="email" name="email" required placeholder="Ej: contacto@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Estado *</Label>
                            <Select name="status" required>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsPointDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" className="bg-[#E30613] hover:bg-[#B30510]">
                            Crear Punto
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
                            onClick={() => handleDeletePoint(point._id?.toString())}
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

              {/* ROUTES TAB */}
              <TabsContent value="routes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Rutas de Evacuación</h2>
                  <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E30613] hover:bg-[#B30510]">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Nueva Ruta
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Crear Nueva Ruta de Evacuación</DialogTitle>
                        <DialogDescription>
                          Complete los datos para registrar una nueva ruta de evacuación
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateRoute} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Ruta *</Label>
                            <Input id="name" name="name" required placeholder="Ej: Ruta A" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Descripción detallada de la ruta..."
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="coordinates">Coordenadas (lat,lng por línea)</Label>
                            <Textarea
                              id="coordinates"
                              name="coordinates"
                              placeholder="Ej: 4.7110,-74.0721\n4.7120,-74.0730"
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="startName">Nombre del Punto de Inicio *</Label>
                            <Input id="startName" name="startName" required placeholder="Ej: Parque Central" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endName">Nombre del Punto de Fin *</Label>
                            <Input id="endName" name="endName" required placeholder="Ej: Hospital XYZ" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="distance">Distancia (metros) *</Label>
                            <Input id="distance" name="distance" type="number" required placeholder="Ej: 5000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estimatedTime">Tiempo Estimado (minutos) *</Label>
                            <Input
                              id="estimatedTime"
                              name="estimatedTime"
                              type="number"
                              required
                              placeholder="Ej: 30"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="difficulty">Dificultad *</Label>
                            <Select name="difficulty" required>
                              <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Seleccionar dificultad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Fácil</SelectItem>
                                <SelectItem value="medium">Medio</SelectItem>
                                <SelectItem value="hard">Difícil</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Estado *</Label>
                            <Select name="status" required>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accessibility">Accesible *</Label>
                            <Select name="accessibility" required>
                              <SelectTrigger id="accessibility">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sí</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="warnings">Advertencias (separadas por comas)</Label>
                            <Input id="warnings" name="warnings" placeholder="Ej: Deslizamiento, inundación" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsRouteDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" className="bg-[#E30613] hover:bg-[#B30510]">
                            Crear Ruta
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {evacuationRoutes.map((route) => (
                    <Card key={route._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{route.name}</CardTitle>
                            <CardDescription className="mt-1">{route.description}</CardDescription>
                          </div>
                          <Badge variant={route.status === "active" ? "default" : "secondary"} className="capitalize">
                            {route.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distancia:</span>
                            <span className="font-medium">{route.distance}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiempo Estimado:</span>
                            <span className="font-medium">{route.estimatedTime} minutos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dificultad:</span>
                            <span className="font-medium capitalize">{route.difficulty}</span>
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
                            onClick={() => handleDeleteRoute(route._id?.toString())}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Eliminar ruta</span>
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
