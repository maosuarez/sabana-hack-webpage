"use client"

import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup, useMap } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface InteractiveMapProps {
  selectedLayer: string
  riskZones?: any[]
  meetingPoints?: any[]
  evacuationRoutes?: any[]
}

// Component to update map center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export function InteractiveMap({
  selectedLayer,
  riskZones = [],
  meetingPoints = [],
  evacuationRoutes = [],
}: InteractiveMapProps) {
  const [center, setCenter] = useState<[number, number]>([4.711, -74.0721]) // Bogotá, Colombia

  // Custom icons
  const meetingPointIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#ef4444"
      case "medium":
        return "#f97316"
      case "low":
        return "#eab308"
      default:
        return "#6b7280"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#22c55e"
      case "moderate":
        return "#f59e0b"
      case "difficult":
        return "#ef4444"
      default:
        return "#3b82f6"
    }
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ borderRadius: "0.75rem" }}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Risk Zones Layer */}
        {selectedLayer === "risk-zones" &&
          riskZones.map((zone, i) => (
            <Circle
              key={zone._id?.toString() || i}
              center={[zone.coordinates.lat, zone.coordinates.lng]}
              radius={zone.radius}
              pathOptions={{
                color: getRiskColor(zone.level),
                fillColor: getRiskColor(zone.level),
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-1">{zone.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nivel:</span>
                      <span className="font-medium capitalize">{zone.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium capitalize">{zone.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Población:</span>
                      <span className="font-medium">{zone.population?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Meeting Points Layer */}
        {selectedLayer === "meeting-points" &&
          meetingPoints.map((point, i) => (
            <Marker
              key={point._id?.toString() || i}
              position={[point.coordinates.lat, point.coordinates.lng]}
              icon={meetingPointIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-1">{point.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{point.address}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium capitalize">{point.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Capacidad:</span>
                      <span className="font-medium">{point.capacity?.toLocaleString()} personas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estado:</span>
                      <span className="font-medium capitalize">{point.status}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Evacuation Routes Layer */}
        {selectedLayer === "evacuation-routes" &&
          evacuationRoutes.map((route, i) => {
            const positions = route.coordinates
              .sort((a: any, b: any) => a.order - b.order)
              .map((coord: any) => [coord.lat, coord.lng] as [number, number])

            return (
              <Polyline
                key={route._id?.toString() || i}
                positions={positions}
                pathOptions={{
                  color: getDifficultyColor(route.difficulty),
                  weight: 4,
                  opacity: 0.8,
                  dashArray: "10, 5",
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-base mb-1">{route.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Distancia:</span>
                        <span className="font-medium">{(route.distance / 1000).toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tiempo estimado:</span>
                        <span className="font-medium">{route.estimatedTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dificultad:</span>
                        <span className="font-medium capitalize">{route.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <span className="font-medium capitalize">{route.status}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            )
          })}
      </MapContainer>

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
