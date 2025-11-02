"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, AlertTriangle, Activity, MapPin, Clock, CheckCircle2 } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeAlerts: 12,
    totalIncidents: 156,
    activeVolunteers: 234,
    peopleHelped: 1847,
  })

  const incidentData = [
    { month: "Ene", incidentes: 45, resueltos: 42 },
    { month: "Feb", incidentes: 52, resueltos: 48 },
    { month: "Mar", incidentes: 38, resueltos: 36 },
    { month: "Abr", incidentes: 61, resueltos: 58 },
    { month: "May", incidentes: 55, resueltos: 52 },
    { month: "Jun", incidentes: 48, resueltos: 47 },
  ]

  const responseTimeData = [
    { hora: "00:00", tiempo: 12 },
    { hora: "04:00", tiempo: 8 },
    { hora: "08:00", tiempo: 15 },
    { hora: "12:00", tiempo: 18 },
    { hora: "16:00", tiempo: 14 },
    { hora: "20:00", tiempo: 11 },
  ]

  const incidentTypeData = [
    { name: "Incendios", value: 35, color: "#ef4444" },
    { name: "Médicos", value: 28, color: "#3b82f6" },
    { name: "Accidentes", value: 22, color: "#f97316" },
    { name: "Naturales", value: 15, color: "#22c55e" },
  ]

  const zoneData = [
    { zona: "Norte", incidentes: 45, nivel: "Alto" },
    { zona: "Sur", incidentes: 32, nivel: "Medio" },
    { zona: "Este", incidentes: 51, nivel: "Alto" },
    { zona: "Oeste", incidentes: 28, nivel: "Bajo" },
  ]

  const recentIncidents = [
    {
      id: 1,
      type: "Incendio",
      location: "Calle 45 #23-12",
      time: "Hace 15 min",
      status: "En progreso",
      priority: "high",
    },
    {
      id: 2,
      type: "Emergencia Médica",
      location: "Av. Principal #67-89",
      time: "Hace 32 min",
      status: "Resuelto",
      priority: "medium",
    },
    {
      id: 3,
      type: "Accidente de Tránsito",
      location: "Carrera 10 #45-23",
      time: "Hace 1 hora",
      status: "En progreso",
      priority: "high",
    },
    {
      id: 4,
      type: "Inundación",
      location: "Barrio El Centro",
      time: "Hace 2 horas",
      status: "Resuelto",
      priority: "low",
    },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeAlerts: Math.floor(Math.random() * 20) + 5,
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 3),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/10">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Dashboard en Tiempo Real</h1>
                  <p className="text-muted-foreground">Monitoreo y análisis de datos de emergencias</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3 animate-pulse text-green-600" />
                En vivo
              </Badge>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#E30613]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">+2 desde la última hora</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Incidentes</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIncidents}</div>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Voluntarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
                  <p className="text-xs text-muted-foreground">En servicio ahora</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Personas Ayudadas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.peopleHelped}</div>
                  <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="incidents">Incidentes</TabsTrigger>
                <TabsTrigger value="zones">Zonas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Incidents Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incidentes por Mes</CardTitle>
                      <CardDescription>Comparación de incidentes reportados vs resueltos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={incidentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="incidentes" fill="#E30613" name="Incidentes" />
                          <Bar dataKey="resueltos" fill="#22c55e" name="Resueltos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Response Time Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tiempo de Respuesta</CardTitle>
                      <CardDescription>Promedio de tiempo de respuesta por hora (minutos)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={responseTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hora" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="tiempo"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            name="Minutos"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Incident Types */}
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tipos de Incidentes</CardTitle>
                      <CardDescription>Distribución por categoría</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={incidentTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {incidentTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Recent Incidents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incidentes Recientes</CardTitle>
                      <CardDescription>Últimas emergencias reportadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentIncidents.map((incident) => (
                          <div
                            key={incident.id}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{incident.type}</span>
                                <Badge
                                  variant={
                                    incident.priority === "high"
                                      ? "destructive"
                                      : incident.priority === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {incident.priority === "high"
                                    ? "Alta"
                                    : incident.priority === "medium"
                                      ? "Media"
                                      : "Baja"}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{incident.location}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">{incident.time}</div>
                                <div className="flex items-center gap-1 text-xs">
                                  {incident.status === "Resuelto" ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Clock className="h-3 w-3 text-orange-600" />
                                  )}
                                  {incident.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="incidents">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis Detallado de Incidentes</CardTitle>
                    <CardDescription>Tendencias y patrones de emergencias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={incidentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="incidentes" stroke="#E30613" strokeWidth={2} name="Incidentes" />
                        <Line type="monotone" dataKey="resueltos" stroke="#22c55e" strokeWidth={2} name="Resueltos" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="zones">
                <Card>
                  <CardHeader>
                    <CardTitle>Incidentes por Zona</CardTitle>
                    <CardDescription>Distribución geográfica de emergencias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={zoneData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="zona" type="category" />
                        <Tooltip />
                        <Bar dataKey="incidentes" fill="#E30613" name="Incidentes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Power BI Embed Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Power BI</CardTitle>
                <CardDescription>Visualizaciones avanzadas y reportes personalizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-lg border border-border bg-muted/30 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Integración con Power BI</p>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Configura tu URL de Power BI Embedded en las variables de entorno (POWERBI_EMBED_URL) para mostrar
                      tus dashboards personalizados aquí
                    </p>
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
