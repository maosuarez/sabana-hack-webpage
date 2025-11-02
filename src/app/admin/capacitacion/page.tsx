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
import { GraduationCap, Plus, Edit, Trash2, Video, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminCapacitacionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      const [coursesRes, videosRes, resourcesRes] = await Promise.all([
        fetch("/api/training/courses"),
        fetch("/api/training/videos"),
        fetch("/api/training/resources"),
      ])

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData.courses || [])
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json()
        setVideos(videosData.videos || [])
      }

      if (resourcesRes.ok) {
        const resourcesData = await resourcesRes.json()
        setResources(resourcesData.resources || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching training data:", error)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newCourse = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      level: formData.get("level"),
      duration: Number.parseInt(formData.get("duration") as string),
      instructor: formData.get("instructor"),
      status: "published",
    }

    try {
      const response = await fetch("/api/training/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchData()
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      console.error("[v0] Error creating course:", error)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este curso?")) return

    try {
      const response = await fetch(`/api/training/courses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("[v0] Error deleting course:", error)
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10">
                  <GraduationCap className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Gestión de Capacitación</h1>
                  <p className="text-muted-foreground">Administrar cursos, videos y recursos educativos</p>
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
            <Tabs defaultValue="courses" className="w-full">
              <TabsList>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Cursos</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E30613] hover:bg-[#B30510]">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Nuevo Curso
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-w-2xl max-h-[90vh] overflow-y-auto"
                      aria-labelledby="dialog-title"
                      aria-describedby="dialog-description"
                    >
                      <DialogHeader>
                        <DialogTitle id="dialog-title">Crear Nuevo Curso</DialogTitle>
                        <DialogDescription id="dialog-description">
                          Complete los datos para crear un nuevo curso de capacitación
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título del Curso *</Label>
                          <Input id="title" name="title" required placeholder="Ej: Primeros Auxilios Básicos" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción *</Label>
                          <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="Descripción detallada del curso..."
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="category">Categoría *</Label>
                            <Select name="category" required>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primeros-auxilios">Primeros Auxilios</SelectItem>
                                <SelectItem value="evacuacion">Evacuación</SelectItem>
                                <SelectItem value="prevencion">Prevención</SelectItem>
                                <SelectItem value="respuesta">Respuesta</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="level">Nivel *</Label>
                            <Select name="level" required>
                              <SelectTrigger id="level">
                                <SelectValue placeholder="Seleccionar nivel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basico">Básico</SelectItem>
                                <SelectItem value="intermedio">Intermedio</SelectItem>
                                <SelectItem value="avanzado">Avanzado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duración (horas) *</Label>
                            <Input id="duration" name="duration" type="number" required placeholder="Ej: 8" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instructor">Instructor *</Label>
                            <Input id="instructor" name="instructor" required placeholder="Ej: Dr. Juan Pérez" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" className="bg-[#E30613] hover:bg-[#B30510]">
                            Crear Curso
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Card key={course._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {course.level}
                          </Badge>
                          <Badge
                            variant={
                              course.status === "published"
                                ? "default"
                                : course.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {course.status === "published"
                              ? "Publicado"
                              : course.status === "draft"
                                ? "Borrador"
                                : "Archivado"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duración:</span>
                            <span className="font-medium">{course.duration}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Instructor:</span>
                            <span className="font-medium">{course.instructor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Inscritos:</span>
                            <span className="font-medium">{course.enrollments || 0}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteCourse(course._id?.toString())}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Eliminar curso</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Videos</h2>
                  <Button className="bg-[#E30613] hover:bg-[#B30510]">
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Nuevo Video
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video) => (
                    <Card key={video._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <Badge variant="outline">{video.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <CardDescription>{video.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vistas:</span>
                            <span className="font-medium">{video.views?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estado:</span>
                            <Badge variant={video.status === "active" ? "default" : "secondary"} className="text-xs">
                              {video.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
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
                            <span className="sr-only">Eliminar video</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Recursos</h2>
                  <Button className="bg-[#E30613] hover:bg-[#B30510]">
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Nuevo Recurso
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Card key={resource._id?.toString()}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <Badge variant="outline" className="uppercase">
                            {resource.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Descargas:</span>
                            <span className="font-medium">{resource.downloads?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estado:</span>
                            <Badge variant={resource.status === "active" ? "default" : "secondary"} className="text-xs">
                              {resource.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
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
                            <span className="sr-only">Eliminar recurso</span>
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
