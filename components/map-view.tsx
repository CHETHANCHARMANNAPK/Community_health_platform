"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface MapLocation {
  lat: number
  lng: number
  title: string
  description?: string
  type?: string
}

interface MapViewProps {
  locations: MapLocation[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
}

export function MapView({ locations, center, zoom = 12, height = "400px" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let map: any = null

    const loadMap = async () => {
      try {
        const L = await import("leaflet")

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        if (!mapRef.current) return

        const defaultCenter = center || (locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 40.7128, lng: -74.006 })

        map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], zoom)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        locations.forEach((loc) => {
          const marker = L.marker([loc.lat, loc.lng]).addTo(map)
          marker.bindPopup(`<b>${loc.title}</b>${loc.description ? `<br/>${loc.description}` : ""}`)
        })

        // Fit bounds if multiple locations
        if (locations.length > 1) {
          const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]))
          map.fitBounds(bounds, { padding: [20, 20] })
        }

        setMapLoaded(true)
      } catch (err) {
        console.error("Failed to load map:", err)
        setError(true)
      }
    }

    // Add Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)
    }

    const timer = setTimeout(loadMap, 100)

    return () => {
      clearTimeout(timer)
      if (map) map.remove()
    }
  }, [locations, center, zoom])

  if (error) {
    // Fallback: show locations as a list
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locations.map((loc, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{loc.title}</p>
                  {loc.description && <p className="text-xs text-muted-foreground">{loc.description}</p>}
                  <a
                    href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border" style={{ height }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      {!mapLoaded && (
        <div className="flex items-center justify-center h-full bg-muted">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
    </div>
  )
}
