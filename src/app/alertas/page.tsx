"use client"

import type React from "react"

import { useState } from "react"
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
import { Bell, AlertTriangle, MapPin, Clock, CheckCircle2, XCircle, Activity } from "lucide-react"
import { useAlerts } from "@/lib/use-alerts"

export default function AlertasPage() {
  const { alerts, loading, sendAlert, updateAlertStatus } = useAlerts()
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    severity: "medium",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendAlert(formData)
    setFormData({
      type: "",
      location: "",
      description: "",
      severity: "medium",
    })
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
    switch (severity) {
      case "critical":
        return "Crítica"
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return severity
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity className="h-4 w-4 animate-pulse text-orange-600" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "dismissed":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "resolved":
        return "Resuelta"
      case "dismissed":
        return "Descartada"
      default:
        return status
    }
  }

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/10">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Sistema de Alertas</h1>
                  <p className="text-muted-foreground">Notificaciones en tiempo real de emergencias</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3 animate-pulse text-green-600" />
                {activeAlerts.length} alertas activas
              </Badge>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              {/* Alerts List */}
              <div>
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="active">Activas ({activeAlerts.length})</TabsTrigger>
                    <TabsTrigger value="resolved">Resueltas ({resolvedAlerts.length})</TabsTrigger>
                    <TabsTrigger value="all">Todas ({alerts.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active" className="space-y-4">
                    {loading ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          Cargando alertas...
                        </CardContent>
                      </Card>
                    ) : activeAlerts.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas activas en este momento
                        </CardContent>
                      </Card>
                    ) : (
                      activeAlerts.map((alert) => (
                        <Card key={alert._id} className="border-l-4 border-l-orange-600">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{alert.type}</CardTitle>
                                  <Badge variant={getSeverityColor(alert.severity)}>
                                    {getSeverityLabel(alert.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(alert.status)}
                                    {getStatusLabel(alert.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {alert.location}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(alert.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(alert.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 text-sm">{alert.description}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateAlertStatus(alert._id, "resolved")}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marcar como Resuelta
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAlertStatus(alert._id, "dismissed")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Descartar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="resolved" className="space-y-4">
                    {resolvedAlerts.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas resueltas
                        </CardContent>
                      </Card>
                    ) : (
                      resolvedAlerts.map((alert) => (
                        <Card key={alert._id} className="border-l-4 border-l-green-600">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{alert.type}</CardTitle>
                                  <Badge variant={getSeverityColor(alert.severity)}>
                                    {getSeverityLabel(alert.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(alert.status)}
                                    {getStatusLabel(alert.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {alert.location}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(alert.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(alert.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{alert.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {alerts.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No hay alertas registradas
                        </CardContent>
                      </Card>
                    ) : (
                      alerts.map((alert) => (
                        <Card
                          key={alert._id}
                          className={`border-l-4 ${
                            alert.status === "active"
                              ? "border-l-orange-600"
                              : alert.status === "resolved"
                                ? "border-l-green-600"
                                : "border-l-gray-400"
                          }`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-lg">{alert.type}</CardTitle>
                                  <Badge variant={getSeverityColor(alert.severity)}>
                                    {getSeverityLabel(alert.severity)}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    {getStatusIcon(alert.status)}
                                    {getStatusLabel(alert.status)}
                                  </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {alert.location}
                                </CardDescription>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(alert.createdAt).toLocaleTimeString("es-CO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div>{new Date(alert.createdAt).toLocaleDateString("es-CO")}</div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{alert.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Create Alert Form */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Reportar Emergencia</CardTitle>
                    <CardDescription>Envía una alerta al sistema de respuesta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Emergencia</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData({ ...formData, type: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Incendio">Incendio</SelectItem>
                            <SelectItem value="Emergencia Médica">Emergencia Médica</SelectItem>
                            <SelectItem value="Accidente de Tránsito">Accidente de Tránsito</SelectItem>
                            <SelectItem value="Inundación">Inundación</SelectItem>
                            <SelectItem value="Deslizamiento">Deslizamiento</SelectItem>
                            <SelectItem value="Terremoto">Terremoto</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="severity">Severidad</Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value) => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger>
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
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                          id="location"
                          placeholder="Dirección o punto de referencia"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe la situación..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-[#E30613] hover:bg-[#B30510]">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Enviar Alerta
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
                        <a href="tel:132">132</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">Bomberos</div>
                        <div className="text-sm text-muted-foreground">Incendios y rescates</div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="tel:119">119</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">Policía</div>
                        <div className="text-sm text-muted-foreground">Seguridad y orden</div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="tel:123">123</a>
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
