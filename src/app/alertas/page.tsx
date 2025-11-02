"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Upload,
  X,
  Loader2,
  Navigation,
} from "lucide-react"

export default function AlertasPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [locationLoading, setLocationLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    severity: "medium",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    department: "",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    affectedPeople: "",
    notes: "",
  })

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch("/api/incidents")
      const data = await response.json()
      setIncidents(data.incidents || [])
    } catch (error) {
      console.error("[v0] Error fetching incidents:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          })
          setLocationLoading(false)
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          alert("No se pudo obtener la ubicación. Por favor ingresa la dirección manualmente.")
          setLocationLoading(false)
        },
      )
    } else {
      alert("Tu navegador no soporta geolocalización")
      setLocationLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter((file) => {
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")
        const isUnder10MB = file.size <= 10 * 1024 * 1024 // 10MB limit
        return (isImage || isVideo) && isUnder10MB
      })

      if (validFiles.length !== selectedFiles.length) {
        alert("Algunos archivos fueron rechazados. Solo se permiten imágenes y videos menores a 10MB.")
      }

      setFiles([...files, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      // Add files
      files.forEach((file) => {
        formDataToSend.append("files", file)
      })

      const response = await fetch("/api/incidents", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        alert("Incidente reportado exitosamente")
        // Reset form
        setFormData({
          title: "",
          type: "",
          severity: "medium",
          description: "",
          latitude: "",
          longitude: "",
          address: "",
          city: "",
          department: "",
          reporterName: "",
          reporterPhone: "",
          reporterEmail: "",
          affectedPeople: "",
          notes: "",
        })
        setFiles([])
        fetchIncidents()
      } else {
        throw new Error("Error al reportar incidente")
      }
    } catch (error) {
      console.error("[v0] Error submitting incident:", error)
      alert("Error al reportar el incidente. Por favor intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const updateIncidentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/incidents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchIncidents()
      }
    } catch (error) {
      console.error("[v0] Error updating incident:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSeverityLabel = (severity: string) => {
    const labels: any = {
      critical: "Crítica",
      high: "Alta",
      medium: "Media",
      low: "Baja",
    }
    return labels[severity] || severity
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
      case "in-progress":
        return <Activity className="h-4 w-4 animate-pulse text-orange-600" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      reported: "Reportado",
      "in-progress": "En Progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
    }
    return labels[status] || status
  }

  const getTypeLabel = (type: string) => {
    const labels: any = {
      medical: "Emergencia Médica",
      fire: "Incendio",
      flood: "Inundación",
      earthquake: "Terremoto",
      accident: "Accidente",
      other: "Otro",
    }
    return labels[type] || type
  }

  const activeIncidents = incidents.filter((i) => ["reported", "in-progress"].includes(i.status))
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1" role="main">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/10">
                  <Bell className="h-6 w-6 text-orange-600" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Sistema de Alertas</h1>
                  <p className="text-muted-foreground">Notificaciones en tiempo real de emergencias</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3 animate-pulse text-green-600" aria-hidden="true" />
                <span aria-live="polite">{activeIncidents.length} alertas activas</span>
              </Badge>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-[1fr_450px]">
              {/* Incidents List */}
              <div>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="active">Activas ({activeIncidents.length})</TabsTrigger>
                    <TabsTrigger value="resolved">Resueltas ({resolvedIncidents.length})</TabsTrigger>
                    <TabsTrigger value="all">Todas ({incidents.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-4">
                    {loading ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                          <p className="mt-2">Cargando alertas...</p>
                        </CardContent>
                      </Card>
                    ) : activeIncidents.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas activas en este momento
                        </CardContent>
                      </Card>
                    ) : (
                      activeIncidents.map((incident) => (
                        <Card key={incident._id} className="border-l-4 border-l-orange-600">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                                  <Badge variant={getSeverityColor(incident.severity)}>
                                    {getSeverityLabel(incident.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(incident.status)}
                                    {getStatusLabel(incident.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  {incident.location.address ||
                                    `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {new Date(incident.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(incident.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-2 text-sm font-medium">{getTypeLabel(incident.type)}</p>
                            <p className="mb-4 text-sm">{incident.description}</p>

                            {incident.attachments && incident.attachments.length > 0 && (
                              <div className="mb-4 flex gap-2 flex-wrap">
                                {incident.attachments.map((attachment: any, idx: number) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    {attachment.type === "image" ? "📷" : "🎥"} {attachment.fileName}
                                  </a>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateIncidentStatus(incident._id, "resolved")}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marcar como Resuelta
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateIncidentStatus(incident._id, "closed")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cerrar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="resolved" className="space-y-4">
                    {resolvedIncidents.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas resueltas
                        </CardContent>
                      </Card>
                    ) : (
                      resolvedIncidents.map((incident) => (
                        <Card key={incident._id} className="border-l-4 border-l-green-600">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                                  <Badge variant={getSeverityColor(incident.severity)}>
                                    {getSeverityLabel(incident.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(incident.status)}
                                    {getStatusLabel(incident.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  {incident.location.address ||
                                    `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {new Date(incident.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(incident.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{incident.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {incidents.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas registradas
                        </CardContent>
                      </Card>
                    ) : (
                      incidents.map((incident) => (
                        <Card
                          key={incident._id}
                          className={`border-l-4 ${
                            ["reported", "in-progress"].includes(incident.status)
                              ? "border-l-orange-600"
                              : incident.status === "resolved"
                                ? "border-l-green-600"
                                : "border-l-gray-400"
                          }`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                                  <Badge variant={getSeverityColor(incident.severity)}>
                                    {getSeverityLabel(incident.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(incident.status)}
                                    {getStatusLabel(incident.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  {incident.location.address ||
                                    `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" aria-hidden="true" />
                                  {new Date(incident.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(incident.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{incident.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Create Incident Form */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Reportar Emergencia</CardTitle>
                    <CardDescription>Envía una alerta al sistema de respuesta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título del Incidente *</Label>
                        <Input
                          id="title"
                          placeholder="Ej: Incendio en edificio residencial"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Emergencia *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                          required
                        >
                          <SelectTrigger id="type" aria-required="true">
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fire">Incendio</SelectItem>
                            <SelectItem value="medical">Emergencia Médica</SelectItem>
                            <SelectItem value="accident">Accidente de Tránsito</SelectItem>
                            <SelectItem value="flood">Inundación</SelectItem>
                            <SelectItem value="earthquake">Terremoto</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="severity">Nivel de Urgencia *</Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value) => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger id="severity" aria-required="true">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="critical">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Ubicación *</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={getCurrentLocation}
                          disabled={locationLoading}
                        >
                          {locationLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Navigation className="mr-2 h-4 w-4" />
                          )}
                          Usar mi ubicación actual
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Latitud"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            required
                            aria-label="Latitud"
                          />
                          <Input
                            placeholder="Longitud"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            required
                            aria-label="Longitud"
                          />
                        </div>
                        <Input
                          placeholder="Dirección"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          aria-label="Dirección"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Ciudad"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            aria-label="Ciudad"
                          />
                          <Input
                            placeholder="Departamento"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            aria-label="Departamento"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe la situación en detalle..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="files">Archivos Adjuntos (Fotos/Videos)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="files"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            aria-label="Seleccionar archivos"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => document.getElementById("files")?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Seleccionar Archivos
                          </Button>
                        </div>
                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-border p-2"
                              >
                                <span className="text-sm truncate flex-1">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  aria-label={`Eliminar ${file.name}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Máximo 10MB por archivo. Formatos: JPG, PNG, MP4, MOV
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reporterName">Tu Nombre *</Label>
                        <Input
                          id="reporterName"
                          placeholder="Nombre completo"
                          value={formData.reporterName}
                          onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="reporterPhone">Teléfono</Label>
                          <Input
                            id="reporterPhone"
                            type="tel"
                            placeholder="3001234567"
                            value={formData.reporterPhone}
                            onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                            aria-label="Teléfono de contacto"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reporterEmail">Email</Label>
                          <Input
                            id="reporterEmail"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={formData.reporterEmail}
                            onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                            aria-label="Correo electrónico"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="affectedPeople">Personas Afectadas (Estimado)</Label>
                        <Input
                          id="affectedPeople"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData.affectedPeople}
                          onChange={(e) => setFormData({ ...formData, affectedPeople: e.target.value })}
                          aria-label="Número de personas afectadas"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-[#E30613] hover:bg-[#B30510]" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Enviar Alerta
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contactos de Emergencia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">Cruz Roja</div>
                        <div className="text-sm text-muted-foreground">Emergencias generales</div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="tel:132" aria-label="Llamar a Cruz Roja 132">
                          132
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">Bomberos</div>
                        <div className="text-sm text-muted-foreground">Incendios y rescates</div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="tel:119" aria-label="Llamar a Bomberos 119">
                          119
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">Policía</div>
                        <div className="text-sm text-muted-foreground">Seguridad y orden</div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="tel:123" aria-label="Llamar a Policía 123">
                          123
                        </a>
                      </Button>
                    </div>
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
