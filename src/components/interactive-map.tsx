"use client"

import { useEffect, useRef, useState } from "react"

interface InteractiveMapProps {
  selectedLayer: string
}

export function InteractiveMap({ selectedLayer }: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Colombia map outline (simplified)
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw risk zones based on selected layer
    if (selectedLayer === "risk-zones") {
      drawRiskZones(ctx, canvas.width, canvas.height)
    } else if (selectedLayer === "heat-map") {
      drawHeatMap(ctx, canvas.width, canvas.height)
    } else if (selectedLayer === "meeting-points") {
      drawMeetingPoints(ctx, canvas.width, canvas.height)
    } else if (selectedLayer === "evacuation-routes") {
      drawEvacuationRoutes(ctx, canvas.width, canvas.height)
    }
  }, [selectedLayer])

  function drawRiskZones(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const zones = [
      { x: width * 0.3, y: height * 0.2, radius: 80, color: "#ef4444", label: "Zona Norte" },
      { x: width * 0.5, y: height * 0.5, radius: 100, color: "#f97316", label: "Zona Centro" },
      { x: width * 0.4, y: height * 0.75, radius: 60, color: "#eab308", label: "Zona Sur" },
      { x: width * 0.7, y: height * 0.4, radius: 90, color: "#ef4444", label: "Zona Este" },
    ]

    zones.forEach((zone) => {
      ctx.beginPath()
      ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2)
      ctx.fillStyle = zone.color + "40"
      ctx.fill()
      ctx.strokeStyle = zone.color
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.fillStyle = "#1a1a1a"
      ctx.font = "bold 14px Inter"
      ctx.textAlign = "center"
      ctx.fillText(zone.label, zone.x, zone.y)
    })
  }

  function drawHeatMap(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
    gradient.addColorStop(0, "#ef4444")
    gradient.addColorStop(0.5, "#f97316")
    gradient.addColorStop(1, "#eab308")

    ctx.fillStyle = gradient
    ctx.globalAlpha = 0.3
    ctx.fillRect(0, 0, width, height)
    ctx.globalAlpha = 1

    // Add heat spots
    const spots = [
      { x: width * 0.3, y: height * 0.3, intensity: 0.8 },
      { x: width * 0.6, y: height * 0.5, intensity: 0.6 },
      { x: width * 0.4, y: height * 0.7, intensity: 0.9 },
    ]

    spots.forEach((spot) => {
      const spotGradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, 100)
      spotGradient.addColorStop(0, `rgba(239, 68, 68, ${spot.intensity})`)
      spotGradient.addColorStop(1, "rgba(239, 68, 68, 0)")
      ctx.fillStyle = spotGradient
      ctx.fillRect(0, 0, width, height)
    })
  }

  function drawMeetingPoints(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const points = [
      { x: width * 0.35, y: height * 0.4, label: "Parque Central" },
      { x: width * 0.6, y: height * 0.3, label: "Estadio" },
      { x: width * 0.45, y: height * 0.65, label: "Plaza" },
      { x: width * 0.7, y: height * 0.55, label: "Centro Comercial" },
    ]

    points.forEach((point) => {
      // Draw marker
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#22c55e"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#1a1a1a"
      ctx.font = "12px Inter"
      ctx.textAlign = "center"
      ctx.fillText(point.label, point.x, point.y + 25)
    })
  }

  function drawEvacuationRoutes(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const routes = [
      { from: { x: width * 0.3, y: height * 0.3 }, to: { x: width * 0.5, y: height * 0.5 } },
      { from: { x: width * 0.5, y: height * 0.5 }, to: { x: width * 0.7, y: height * 0.4 } },
      { from: { x: width * 0.4, y: height * 0.7 }, to: { x: width * 0.5, y: height * 0.5 } },
    ]

    routes.forEach((route) => {
      ctx.beginPath()
      ctx.moveTo(route.from.x, route.from.y)
      ctx.lineTo(route.to.x, route.to.y)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 4
      ctx.setLineDash([10, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Draw arrow
      const angle = Math.atan2(route.to.y - route.from.y, route.to.x - route.from.x)
      const arrowSize = 15
      ctx.beginPath()
      ctx.moveTo(route.to.x, route.to.y)
      ctx.lineTo(
        route.to.x - arrowSize * Math.cos(angle - Math.PI / 6),
        route.to.y - arrowSize * Math.sin(angle - Math.PI / 6),
      )
      ctx.lineTo(
        route.to.x - arrowSize * Math.cos(angle + Math.PI / 6),
        route.to.y - arrowSize * Math.sin(angle + Math.PI / 6),
      )
      ctx.closePath()
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
    })
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
      <canvas ref={canvasRef} className="h-full w-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-sm shadow-lg backdrop-blur">
        <div className="font-medium">Capa activa:</div>
        <div className="text-muted-foreground">
          {selectedLayer === "risk-zones" && "Zonas de Riesgo"}
          {selectedLayer === "heat-map" && "Mapa de Calor"}
          {selectedLayer === "meeting-points" && "Puntos de Encuentro"}
          {selectedLayer === "evacuation-routes" && "Rutas de Evacuación"}
        </div>
      </div>
    </div>
  )
}
