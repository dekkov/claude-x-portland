import { useEffect } from "react"
import type mapboxgl from "mapbox-gl"
import { useAppState } from "../../context/AppContext"
import { SANE_EVENTS } from "../../data/events"
import { STUPID_EVENTS } from "../../data/stupid-events"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { CATEGORY_MAP } from "../../config/constants"

const SOURCE_ID = "neighborhoods"
const FILL_LAYER_ID = "neighborhood-fill"     // vivid ground color under buildings
const GLOW_LAYER_ID = "neighborhood-glow"     // blurred border halo
const BORDER_LAYER_ID = "neighborhood-border" // crisp border

const UNIFIED_FILL = "#E8DEFF" // soft lavender-white for all active neighborhoods

interface NeighborhoodVisual {
  readonly fillColor: string
  readonly glowColor: string
  readonly borderColor: string
  readonly intensity: number
}

function getActiveNeighborhoods(
  mode: "sane" | "unhinged",
  activeCategories: ReadonlySet<string>
): Map<string, NeighborhoodVisual> {
  const result = new Map<string, NeighborhoodVisual>()

  if (mode === "sane") {
    for (const evt of SANE_EVENTS) {
      if (!activeCategories.has(evt.category)) continue
      const hood = NEIGHBORHOOD_BY_ID.get(evt.neighborhoodId)
      if (!hood) continue
      const cat = CATEGORY_MAP[evt.category]
      if (!cat) continue
      if (!result.has(hood.name)) {
        const isNature = evt.category === "nature"
        result.set(hood.name, {
          fillColor: UNIFIED_FILL,
          glowColor: isNature ? "#FFFFFF" : cat.glowColor,
          borderColor: isNature ? "#FFFFFF" : cat.color,
          intensity: 0.7,
        })
      }
    }
  } else {
    for (const evt of STUPID_EVENTS) {
      if (!activeCategories.has(evt.category)) continue
      const hood = NEIGHBORHOOD_BY_ID.get(evt.neighborhoodId)
      if (!hood) continue
      const cat = CATEGORY_MAP[evt.category]
      if (!cat) continue
      const existing = result.get(hood.name)
      if (!existing || evt.metricValue > existing.intensity) {
        result.set(hood.name, {
          fillColor: UNIFIED_FILL,
          glowColor: cat.glowColor,
          borderColor: cat.color,
          intensity: evt.metricValue,
        })
      }
    }
  }

  return result
}

export function NeighborhoodLayer({ map }: { map: mapboxgl.Map }) {
  const { mode, activeCategories } = useAppState()

  useEffect(() => {
    if (map.getSource(SOURCE_ID)) return

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: "/portland-neighborhoods.geojson",
    })

    // 3D fill-extrusion — slot "middle" = above roads, below 3D buildings
    map.addLayer({
      id: FILL_LAYER_ID,
      type: "fill-extrusion",
      source: SOURCE_ID,
      slot: "middle",
      paint: {
        "fill-extrusion-color": "rgba(0,0,0,0)",
        "fill-extrusion-height": 0,
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0,
      },
    } as unknown as mapboxgl.Layer & { slot: string })

    // Wide blurred border glow
    map.addLayer({
      id: GLOW_LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      slot: "top",
      paint: {
        "line-color": "rgba(0,0,0,0)",
        "line-width": 18,
        "line-blur": 15,
        "line-opacity": 0.9,
      },
    } as mapboxgl.LineLayer & { slot: string })

    // Crisp border
    map.addLayer({
      id: BORDER_LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      slot: "top",
      paint: {
        "line-color": "rgba(12, 74, 110, 0.3)",
        "line-width": 1,
      },
    } as mapboxgl.LineLayer & { slot: string })

    let hoveredName: string | null = null

    map.on("mousemove", FILL_LAYER_ID, (e) => {
      map.getCanvas().style.cursor = "pointer"
      const name = e.features?.[0]?.properties?.NAME as string | undefined
      if (name && name !== hoveredName) {
        hoveredName = name
        if (map.getLayer(GLOW_LAYER_ID)) {
          map.setPaintProperty(GLOW_LAYER_ID, "line-width", [
            "case",
            ["==", ["get", "NAME"], name],
            28,
            18,
          ])
        }
      }
    })
    map.on("mouseleave", FILL_LAYER_ID, () => {
      map.getCanvas().style.cursor = ""
      hoveredName = null
      if (map.getLayer(GLOW_LAYER_ID)) {
        map.setPaintProperty(GLOW_LAYER_ID, "line-width", 18)
      }
    })

    return () => {
      ;[BORDER_LAYER_ID, GLOW_LAYER_ID, FILL_LAYER_ID].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id)
      })
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
    }
  }, [map])

  useEffect(() => {
    if (!map.getLayer(FILL_LAYER_ID)) return

    const active = getActiveNeighborhoods(mode, activeCategories)

    if (active.size === 0) {
      map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-color", "rgba(0,0,0,0)")
      map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-height", 0)
      map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-opacity", 0)
      map.setPaintProperty(GLOW_LAYER_ID, "line-color", "rgba(0,0,0,0)")
      map.setPaintProperty(BORDER_LAYER_ID, "line-color", "rgba(12, 74, 110, 0.25)")
      map.setPaintProperty(BORDER_LAYER_ID, "line-width", 0.5)
      return
    }

    const fillColor: unknown[] = ["match", ["get", "NAME"]]
    const glowColor: unknown[] = ["match", ["get", "NAME"]]
    const borderColor: unknown[] = ["match", ["get", "NAME"]]
    const borderWidth: unknown[] = ["match", ["get", "NAME"]]
    const fillHeight: unknown[] = ["match", ["get", "NAME"]]
    const fillOpacity: unknown[] = ["match", ["get", "NAME"]]

    for (const [name, visual] of active) {
      fillColor.push(name, visual.fillColor)
      glowColor.push(name, visual.glowColor)
      borderColor.push(name, visual.borderColor)
      borderWidth.push(name, 3)
      fillHeight.push(name, mode === "unhinged" ? visual.intensity * 80 : 30)
      fillOpacity.push(name, mode === "unhinged" ? 0.4 + visual.intensity * 0.4 : 0.55)
    }

    // Inactive neighborhoods: transparent fill, subtle border, no height
    fillColor.push("rgba(0,0,0,0)")
    glowColor.push("rgba(0,0,0,0)")
    borderColor.push("rgba(12, 74, 110, 0.25)")
    borderWidth.push(0.5)
    fillHeight.push(0)
    fillOpacity.push(0)

    map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-color", fillColor)
    map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-height", fillHeight)
    map.setPaintProperty(FILL_LAYER_ID, "fill-extrusion-opacity", fillOpacity)
    map.setPaintProperty(GLOW_LAYER_ID, "line-color", glowColor)
    map.setPaintProperty(BORDER_LAYER_ID, "line-color", borderColor)
    map.setPaintProperty(BORDER_LAYER_ID, "line-width", borderWidth)
  }, [map, mode, activeCategories])

  return null
}
