import { useRef, useState, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import { MAP_CONFIG } from "../../../config/constants"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const CHERRY_PINK = "#FFB7C5"

function applyCherryBlossomTrees(map: mapboxgl.Map): boolean {
  // Approach 1: Modify the resolved style JSON and re-apply
  try {
    const style = map.getStyle()
    let modified = false

    if (style.imports) {
      for (const imp of style.imports) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layers = (imp as any).data?.layers
        if (!layers) continue
        for (const layer of layers) {
          if (layer.type === "model" && /tree/i.test(layer.id)) {
            if (!layer.paint) layer.paint = {}
            layer.paint["model-color"] = CHERRY_PINK
            layer.paint["model-color-mix-intensity"] = 0.9
            modified = true
          }
        }
      }
    }

    if (modified) {
      map.setStyle(style)
      return true
    }
  } catch {
    // Style JSON approach failed
  }

  // Approach 2: Scan internal layer map for model layers
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internalStyle = (map as any).style
    const order: string[] = internalStyle?._order ?? []
    for (const layerId of order) {
      if (/tree/i.test(layerId)) {
        map.setPaintProperty(layerId, "model-color", CHERRY_PINK)
        map.setPaintProperty(layerId, "model-color-mix-intensity", 0.9)
        return true
      }
    }
  } catch {
    // Internal API approach failed
  }

  return false
}

export function useMapbox(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)
  const cherryApplied = useRef(false)

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
        map.setConfigProperty("basemap", "theme", "default")
        map.setConfigProperty("basemap", "lightPreset", "day")
        map.setConfigProperty("basemap", "showPointOfInterestLabels", false)
        // Keep default greenspace color — cherry blossoms only along Naito Pkwy
      } catch {
        // Fallback: standard style without config properties
      }

      // Cherry blossom trees — best-effort, don't block loading
      if (!cherryApplied.current) {
        cherryApplied.current = true
        applyCherryBlossomTrees(map)
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
