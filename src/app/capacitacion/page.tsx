"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Play, Clock, Users, Search, BookOpen, Video, FileText } from "lucide-react"

export default function CapacitacionPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const courses = [
    {
      id: 1,
      title: "Primeros Auxilios Básicos",
      description: "Aprende técnicas esenciales de primeros auxilios para situaciones de emergencia",
      duration: "2 horas",
      students: 1234,
      level: "Básico",
      category: "Primeros Auxilios",
      thumbnail: "/first-aid-training.jpg",
    },
    {
      id: 2,
      title: "Evacuación en Emergencias",
      description: "Procedimientos y protocolos para evacuación segura en diferentes escenarios",
      duration: "1.5 horas",
      students: 892,
      level: "Intermedio",
      category: "Evacuación",
      thumbnail: "/evacuation-training.jpg",
    },
    {
      id: 3,
      title: "RCP y Desfibrilación",
      description: "Técnicas de reanimación cardiopulmonar y uso de desfibriladores",
      duration: "3 horas",
      students: 2156,
      level: "Avanzado",
      category: "Primeros Auxilios",
      thumbnail: "/cpr-training.jpg",
    },
    {
      id: 4,
      title: "Gestión de Crisis",
      description: "Coordinación y liderazgo en situaciones de emergencia",
      duration: "4 horas",
      students: 567,
      level: "Avanzado",
      category: "Gestión",
      thumbnail: "/crisis-management.jpg",
    },
    {
      id: 5,
      title: "Prevención de Incendios",
      description: "Identificación de riesgos y prevención de incendios en diferentes entornos",
      duration: "2.5 horas",
      students: 1089,
      level: "Básico",
      category: "Prevención",
      thumbnail: "/fire-prevention.jpg",
    },
    {
      id: 6,
      title: "Atención Psicológica en Crisis",
      description: "Primeros auxilios psicológicos para víctimas de emergencias",
      duration: "3 horas",
      students: 743,
      level: "Intermedio",
      category: "Psicología",
      thumbnail: "/psychological-first-aid.jpg",
    },
  ]

  const videos = [
    {
      id: 1,
      title: "Cómo realizar RCP correctamente",
      youtubeId: "dQw4w9WgXcQ",
      duration: "10:23",
      views: 45000,
    },
    {
      id: 2,
      title: "Qué hacer en caso de terremoto",
      youtubeId: "dQw4w9WgXcQ",
      duration: "8:15",
      views: 32000,
    },
    {
      id: 3,
      title: "Primeros auxilios para quemaduras",
      youtubeId: "dQw4w9WgXcQ",
      duration: "6:45",
      views: 28000,
    },
    {
      id: 4,
      title: "Evacuación segura en edificios",
      youtubeId: "dQw4w9WgXcQ",
      duration: "12:30",
      views: 19000,
    },
  ]

  const resources = [
    {
      title: "Manual de Primeros Auxilios",
      type: "PDF",
      size: "2.5 MB",
      downloads: 5432,
    },
    {
      title: "Guía de Evacuación",
      type: "PDF",
      size: "1.8 MB",
      downloads: 3210,
    },
    {
      title: "Protocolos de Emergencia",
      type: "PDF",
      size: "3.2 MB",
      downloads: 4567,
    },
    {
      title: "Lista de Verificación de Seguridad",
      type: "PDF",
      size: "0.5 MB",
      downloads: 6789,
    },
  ]

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Capacitación y Entrenamiento</h1>
                <p className="text-muted-foreground">
                  Aprende habilidades esenciales para la prevención y atención de emergencias
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos, videos o recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="courses">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Cursos
                </TabsTrigger>
                <TabsTrigger value="videos">
                  <Video className="mr-2 h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <FileText className="mr-2 h-4 w-4" />
                  Recursos
                </TabsTrigger>
              </TabsList>

              {/* Courses Tab */}
              <TabsContent value="courses">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button size="lg" className="bg-[#E30613] hover:bg-[#B30510]">
                            <Play className="mr-2 h-5 w-5" />
                            Comenzar
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos">
                <div className="grid gap-6 md:grid-cols-2">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {video.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            {video.views.toLocaleString()} vistas
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource, index) => (
                    <Card key={index} className="transition-all hover:shadow-lg">
                      <CardHeader>
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#E30613]/10">
                          <FileText className="h-6 w-6 text-[#E30613]" />
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.type} • {resource.size}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3 text-sm text-muted-foreground">
                          {resource.downloads.toLocaleString()} descargas
                        </div>
                        <Button className="w-full bg-[#E30613] hover:bg-[#B30510]">Descargar</Button>
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
