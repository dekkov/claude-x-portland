import { useRef, useState, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import { MAP_CONFIG } from "../../../config/constants"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export function useMapbox(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: 10, // Start zoomed out for cinematic reveal
      pitch: 30,
      bearing: MAP_CONFIG.bearing,
      antialias: true,
    })

    map.on("style.load", () => {
      // Bright, colorful base with visible 3D buildings
      try {
        map.setConfigProperty("basemap", "theme", "monochrome")
        map.setConfigProperty("basemap", "lightPreset", "dusk")
        map.setConfigProperty("basemap", "showPointOfInterestLabels", false)
      } catch {
        // Fallback: standard style without config properties
      }

      // Cinematic opening: zoom in after load
      setTimeout(() => {
        map.flyTo({
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          pitch: MAP_CONFIG.pitch,
          bearing: MAP_CONFIG.bearing,
          duration: 3000,
          essential: true,
        })
      }, 500)

      setLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [containerRef])

  return { map: mapRef.current, loaded }
}
