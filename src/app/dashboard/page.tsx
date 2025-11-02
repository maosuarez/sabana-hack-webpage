"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, AlertTriangle, Activity, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react"
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
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeAlerts: 0,
    totalIncidents: 0,
    criticalIncidents: 0,
    peopleHelped: 0,
    averageResponseTime: 0,
  })

  const [incidentData, setIncidentData] = useState<any[]>([])
  const [incidentTypeData, setIncidentTypeData] = useState<any[]>([])
  const [incidentSeverityData, setIncidentSeverityData] = useState<any[]>([])
  const [neighborhoodData, setneighborhoodData] = useState<any[]>([])
  const [recentIncidents, setRecentIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedZone1, setSelectedZone1] = useState<string>("")
  const [selectedZone2, setSelectedZone2] = useState<string>("")
  const [zone1Stats, setZone1Stats] = useState<any>(null)
  const [zone2Stats, setZone2Stats] = useState<any>(null)
  const [loadingZones, setLoadingZones] = useState(false)
  const [availableZones, setAvailableZones] = useState<string[]>([])

  useEffect(() => {
    fetchDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (neighborhoodData.length > 0) {
      const zones = neighborhoodData.map((d) => d.zona).filter(Boolean)
      setAvailableZones(zones)
      if (zones.length >= 2 && !selectedZone1 && !selectedZone2) {
        setSelectedZone1(zones[0])
        setSelectedZone2(zones[1])
      }
    }
  }, [neighborhoodData])

  useEffect(() => {
    if (selectedZone1 && selectedZone2) {
      fetchZoneComparison()
    }
  }, [selectedZone1, selectedZone2])

  const fetchZoneComparison = async () => {
    setLoadingZones(true)
    try {
      const [zone1Res, zone2Res] = await Promise.all([
        fetch(`/api/dashboard/zone-stats?zone=${encodeURIComponent(selectedZone1)}`),
        fetch(`/api/dashboard/zone-stats?zone=${encodeURIComponent(selectedZone2)}`),
      ])

      if (zone1Res.ok) {
        const data = await zone1Res.json()
        setZone1Stats(data)
      }

      if (zone2Res.ok) {
        const data = await zone2Res.json()
        setZone2Stats(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching zone comparison:", error)
    } finally {
      setLoadingZones(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/incidents"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (incidentsRes.ok) {
        const incidentsData = await incidentsRes.json()

        // Format incidents by month
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const formattedMonthData = incidentsData.incidentsByMonth.map((item: any) => ({
          month: monthNames[item._id.month - 1],
          incidentes: item.total,
          resueltos: item.resolved,
        }))
        setIncidentData(formattedMonthData)

        // Format incidents by type
        const typeColors: Record<string, string> = {
          "inundacion por obstruccion de desagues": "#06b6d4",
          "inundacion por desborde de rio o quebrada": "#0ea5e9",
          "inundacion por devolucion de aguas negras": "#0284c7",
          "inundacion por lluvias intensas": "#38bdf8",
          "inundacion por taponamiento de alcantarillado": "#22d3ee",
          "emergencia medica comunitaria": "#3b82f6",
          "incendio estructural menor": "#ef4444",
          "accidente de transito leve": "#f97316",
          "otro": "#6b7280",
        }

        const typeLabels: Record<string, string> = {
          "inundacion por obstruccion de desagues": "Obstrucción de desagües",
          "inundacion por desborde de rio o quebrada": "Desborde de río o quebrada",
          "inundacion por devolucion de aguas negras": "Devolución de aguas negras",
          "inundacion por lluvias intensas": "Lluvias intensas",
          "inundacion por taponamiento de alcantarillado": "Taponamiento de alcantarillado",
          "emergencia medica comunitaria": "Emergencia Médica",
          "incendio estructural menor": "Incendio",
          "accidente de transito leve": "Accidente",
          "otro": "Otro",
        }

        const formattedTypeData = incidentsData.incidentsByType.map((item: any) => ({
          name: typeLabels[item._id] || item._id,
          value: item.count,
          color: typeColors[item._id] || "#6b7280",
        }))
        setIncidentTypeData(formattedTypeData)

        // Format incidents by severity
        const severityColors: any = {
          low: "#22c55e",
          medium: "#eab308",
          high: "#f97316",
          critical: "#ef4444",
        }
        const severityLabels: any = {
          low: "Baja",
          medium: "Media",
          high: "Alta",
          critical: "Crítica",
        }
        const formattedSeverityData = incidentsData.incidentsBySeverity.map((item: any) => ({
          name: severityLabels[item._id] || item._id,
          value: item.count,
          color: severityColors[item._id] || "#6b7280",
        }))
        setIncidentSeverityData(formattedSeverityData)

        // Format incidents by department
        const formattedneighborhoodData = incidentsData.incidentsByNeighborhood.map((item: any) => ({
          zona: item._id,
          incidentes: item.count,
        }))
        setneighborhoodData(formattedneighborhoodData)

        // Format recent incidents
        setRecentIncidents(incidentsData.recentIncidents.slice(0, 5))
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
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

  const getSeverityBadge = (severity: string) => {
    const variants: any = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    }
    return variants[severity] || "secondary"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#E30613]" />
            <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                  <h1 className="text-3xl font-bold">Dashboard en Tiempo Real</h1>
                  <p className="text-muted-foreground">Monitoreo y análisis de datos de emergencias</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3 animate-pulse text-green-600" aria-hidden="true" />
                <span aria-live="polite">En vivo</span>
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
                  <AlertTriangle className="h-4 w-4 text-[#E30613]" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" aria-live="polite">
                    {stats.activeAlerts}
                  </div>
                  <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Incidentes</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIncidents}</div>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Incidentes Críticos</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.criticalIncidents}</div>
                  <p className="text-xs text-muted-foreground">Máxima prioridad</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Personas Ayudadas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.peopleHelped}</div>
                  <p className="text-xs text-muted-foreground">Total histórico</p>
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
                <TabsTrigger value="zones">Comparación de Zonas</TabsTrigger>
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
                      {incidentData.length > 0 ? (
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
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          No hay datos disponibles
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Response Time */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tiempo de Respuesta Promedio</CardTitle>
                      <CardDescription>Tiempo promedio desde reporte hasta resolución</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-[#E30613]">{stats.averageResponseTime}</div>
                          <div className="text-xl text-muted-foreground mt-2">minutos</div>
                          <p className="text-sm text-muted-foreground mt-4">Tiempo promedio de respuesta del equipo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Incident Types and Recent */}
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tipos de Incidentes</CardTitle>
                      <CardDescription>Distribución por categoría</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {incidentTypeData.length > 0 ? (
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
                      ) : (
                        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                          No hay datos disponibles
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Incidents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incidentes Recientes</CardTitle>
                      <CardDescription>Últimas emergencias reportadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentIncidents.length > 0 ? (
                        <div className="space-y-3">
                          {recentIncidents.map((incident) => (
                            <div
                              key={incident._id}
                              className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{incident.title}</span>
                                  <Badge variant={getSeverityBadge(incident.severity)} className="text-xs">
                                    {incident.severity}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {getTypeLabel(incident.type)} • {incident.location?.address || "Sin dirección"}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(incident.createdAt).toLocaleDateString("es-CO")}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs">
                                    {incident.status === "resolved" ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-600" aria-hidden="true" />
                                    ) : (
                                      <Clock className="h-3 w-3 text-orange-600" aria-hidden="true" />
                                    )}
                                    {incident.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">No hay incidentes recientes</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="incidents">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis por Severidad</CardTitle>
                      <CardDescription>Distribución de incidentes por nivel de urgencia</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {incidentSeverityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={incidentSeverityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" name="Incidentes">
                              {incidentSeverityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          No hay datos disponibles
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tendencia Mensual</CardTitle>
                      <CardDescription>Evolución de incidentes en los últimos meses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {incidentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={incidentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="incidentes"
                              stroke="#E30613"
                              strokeWidth={2}
                              name="Incidentes"
                            />
                            <Line
                              type="monotone"
                              dataKey="resueltos"
                              stroke="#22c55e"
                              strokeWidth={2}
                              name="Resueltos"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          No hay datos disponibles
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="zones" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparación de Zonas</CardTitle>
                    <CardDescription>
                      Selecciona dos departamentos para comparar sus métricas de emergencia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <div>
                        <label htmlFor="zone1-select" className="text-sm font-medium mb-2 block">
                          Zona 1
                        </label>
                        <select
                          id="zone1-select"
                          value={selectedZone1}
                          onChange={(e) => setSelectedZone1(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Seleccionar primera zona para comparar"
                        >
                          <option value="">Seleccionar zona...</option>
                          {availableZones.map((zone) => (
                            <option key={zone} value={zone} disabled={zone === selectedZone2}>
                              {zone}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="zone2-select" className="text-sm font-medium mb-2 block">
                          Zona 2
                        </label>
                        <select
                          id="zone2-select"
                          value={selectedZone2}
                          onChange={(e) => setSelectedZone2(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Seleccionar segunda zona para comparar"
                        >
                          <option value="">Seleccionar zona...</option>
                          {availableZones.map((zone) => (
                            <option key={zone} value={zone} disabled={zone === selectedZone1}>
                              {zone}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {loadingZones ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#E30613]" />
                      </div>
                    ) : zone1Stats && zone2Stats ? (
                      <div className="space-y-6">
                        {/* Key Metrics Comparison */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg border border-border p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-3">Total de Incidentes</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{zone1Stats.totalIncidents}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone1}</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{zone2Stats.totalIncidents}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone2}</div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-border p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-3">Incidentes Activos</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{zone1Stats.activeIncidents}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone1}</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{zone2Stats.activeIncidents}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone2}</div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-border p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-3">Tasa de Resolución</div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{zone1Stats.resolutionRate}%</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone1}</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{zone2Stats.resolutionRate}%</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone2}</div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg border border-border p-4">
                            <div className="text-sm font-medium text-muted-foreground mb-3">
                              Tiempo de Respuesta (min)
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{zone1Stats.averageResponseTime}</div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone1}</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">
                                  {zone2Stats.averageResponseTime}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">{selectedZone2}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Comparison Cards */}
                        <div className="grid gap-6 lg:grid-cols-2">
                          {/* Zone 1 Details */}
                          <Card className="border-blue-200 bg-blue-50/50">
                            <CardHeader>
                              <CardTitle className="text-blue-700">{selectedZone1}</CardTitle>
                              <CardDescription>Análisis detallado de la zona</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Incidentes Críticos</div>
                                  <div className="text-xl font-bold text-[#E30613]">{zone1Stats.criticalIncidents}</div>
                                </div>
                                <div className="rounded-lg bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Personas Afectadas</div>
                                  <div className="text-xl font-bold">{zone1Stats.peopleAffected}</div>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Incidentes por Tipo</div>
                                <div className="space-y-2">
                                  {zone1Stats.incidentsByType.slice(0, 5).map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between">
                                      <span className="text-sm">{getTypeLabel(item._id)}</span>
                                      <Badge variant="secondary">{item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Distribución por Severidad</div>
                                <div className="space-y-2">
                                  {zone1Stats.incidentsBySeverity.map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between">
                                      <span className="text-sm capitalize">{item._id}</span>
                                      <Badge variant={getSeverityBadge(item._id)}>{item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Zone 2 Details */}
                          <Card className="border-purple-200 bg-purple-50/50">
                            <CardHeader>
                              <CardTitle className="text-purple-700">{selectedZone2}</CardTitle>
                              <CardDescription>Análisis detallado de la zona</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Incidentes Críticos</div>
                                  <div className="text-xl font-bold text-[#E30613]">{zone2Stats.criticalIncidents}</div>
                                </div>
                                <div className="rounded-lg bg-background p-3">
                                  <div className="text-xs text-muted-foreground mb-1">Personas Afectadas</div>
                                  <div className="text-xl font-bold">{zone2Stats.peopleAffected}</div>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Incidentes por Tipo</div>
                                <div className="space-y-2">
                                  {zone2Stats.incidentsByType.slice(0, 5).map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between">
                                      <span className="text-sm">{getTypeLabel(item._id)}</span>
                                      <Badge variant="secondary">{item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Distribución por Severidad</div>
                                <div className="space-y-2">
                                  {zone2Stats.incidentsBySeverity.map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between">
                                      <span className="text-sm capitalize">{item._id}</span>
                                      <Badge variant={getSeverityBadge(item._id)}>{item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Visual Comparison Chart */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Comparación Visual</CardTitle>
                            <CardDescription>Métricas clave lado a lado</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart
                                data={[
                                  {
                                    metric: "Total",
                                    [selectedZone1]: zone1Stats.totalIncidents,
                                    [selectedZone2]: zone2Stats.totalIncidents,
                                  },
                                  {
                                    metric: "Activos",
                                    [selectedZone1]: zone1Stats.activeIncidents,
                                    [selectedZone2]: zone2Stats.activeIncidents,
                                  },
                                  {
                                    metric: "Resueltos",
                                    [selectedZone1]: zone1Stats.resolvedIncidents,
                                    [selectedZone2]: zone2Stats.resolvedIncidents,
                                  },
                                  {
                                    metric: "Críticos",
                                    [selectedZone1]: zone1Stats.criticalIncidents,
                                    [selectedZone2]: zone2Stats.criticalIncidents,
                                  },
                                ]}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="metric" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={selectedZone1} fill="#3b82f6" name={selectedZone1} />
                                <Bar dataKey={selectedZone2} fill="#a855f7" name={selectedZone2} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        Selecciona dos zonas para comparar sus métricas
                      </div>
                    )}
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
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
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
