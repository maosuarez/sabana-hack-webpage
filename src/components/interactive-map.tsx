"use client"

import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"

interface InteractiveMapProps {
  selectedLayer: string
  selectedNeighborhood: "la-maria" | "danuvio"
}

export function InteractiveMap({ selectedLayer, selectedNeighborhood }: InteractiveMapProps) {
  const [center, setCenter] = useState<[number, number]>([4.5748, -74.2181]) // La María por defecto

  // Coordenadas por barrio
  const neighborhoods = {
    "la-maria": { lat: 4.5748, lng: -74.2181 },
    "danuvio": { lat: 4.5822, lng: -74.2146 },
  }

  useEffect(() => {
    setCenter([neighborhoods[selectedNeighborhood].lat, neighborhoods[selectedNeighborhood].lng])
  }, [selectedNeighborhood])

  // Ejemplos de capas
  const riskZones = [
    { lat: center[0] + 0.001, lng: center[1] + 0.001, color: "red", label: "Zona Norte" },
    { lat: center[0] - 0.001, lng: center[1] - 0.001, color: "orange", label: "Zona Sur" },
  ]

  const meetingPoints = [
    { lat: center[0] + 0.0005, lng: center[1], label: "Parque Central" },
    { lat: center[0], lng: center[1] + 0.0005, label: "Colegio del barrio" },
  ]

  const evacuationRoutes = [
    [
      [center[0] - 0.0005, center[1] - 0.0005],
      [center[0], center[1]],
      [center[0] + 0.0005, center[1] + 0.0005],
    ],
  ]

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ borderRadius: "0.75rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Capas dinámicas */}
        {selectedLayer === "risk-zones" &&
          riskZones.map((zone, i) => (
            <Circle
              key={i}
              center={[zone.lat, zone.lng]}
              radius={80}
              color={zone.color}
              fillOpacity={0.3}
            >
              <Popup>{zone.label}</Popup>
            </Circle>
          ))}

        {selectedLayer === "meeting-points" &&
          meetingPoints.map((p, i) => (
            <Marker
              key={i}
              position={[p.lat, p.lng]}
              icon={L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [30, 30],
              })}
            >
              <Popup>{p.label}</Popup>
            </Marker>
          ))}

        {selectedLayer === "evacuation-routes" &&
          evacuationRoutes.map((route, i) => (
            <Polyline key={i} positions={route} color="blue" weight={4} dashArray="10,5">
              <Popup>Ruta de evacuación</Popup>
            </Polyline>
          ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-2 text-sm shadow-lg backdrop-blur">
        <div className="font-medium">Capa activa:</div>
        <div className="text-muted-foreground">
          {selectedLayer === "risk-zones" && "Zonas de Riesgo"}
          {selectedLayer === "heat-map" && "Mapa de Calor"}
          {selectedLayer === "meeting-points" && "Puntos de Encuentro"}
          {selectedLayer === "evacuation-routes" && "Rutas de Evacuación"}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Barrio: {selectedNeighborhood === "la-maria" ? "La María" : "El Danuvio"}
        </div>
      </div>
    </div>
  )
}
