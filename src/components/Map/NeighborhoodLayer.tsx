import { useEffect } from "react"
import type { Map as MapboxMap, FillLayer, LineLayer, ExpressionSpecification } from "mapbox-gl"
import { useAppState } from "../../context/AppContext"
import { SANE_EVENTS } from "../../data/events"
import { STUPID_EVENTS } from "../../data/stupid-events"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { CATEGORY_MAP } from "../../config/constants"

const SOURCE_ID = "neighborhoods"
const FILL_LAYER_ID = "neighborhood-fill"
const GLOW_LAYER_ID = "neighborhood-glow"
const BORDER_LAYER_ID = "neighborhood-border"

const UNIFIED_FILL = "#E8DEFF"

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

export function NeighborhoodLayer({ map }: { map: MapboxMap }) {
  const { mode, activeCategories } = useAppState()

  useEffect(() => {
    if (map.getSource(SOURCE_ID)) return

    map.addSource(SOURCE_ID, {
      type: "geojson",
      data: "/portland-neighborhoods.geojson",
    })

    // Flat fill — much cheaper than fill-extrusion
    map.addLayer({
      id: FILL_LAYER_ID,
      type: "fill",
      source: SOURCE_ID,
      slot: "middle",
      paint: {
        "fill-color": "rgba(0,0,0,0)",
        "fill-opacity": 0.35,
      },
    } as FillLayer & { slot: string })

    // Blurred border glow
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
    } as LineLayer & { slot: string })

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
    } as LineLayer & { slot: string })

    // Lightweight hover — cursor only, no paint property thrashing
    map.on("mousemove", FILL_LAYER_ID, () => {
      map.getCanvas().style.cursor = "pointer"
    })
    map.on("mouseleave", FILL_LAYER_ID, () => {
      map.getCanvas().style.cursor = ""
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
      map.setPaintProperty(FILL_LAYER_ID, "fill-color", "rgba(0,0,0,0)")
      map.setPaintProperty(GLOW_LAYER_ID, "line-color", "rgba(0,0,0,0)")
      map.setPaintProperty(BORDER_LAYER_ID, "line-color", "rgba(12, 74, 110, 0.25)")
      map.setPaintProperty(BORDER_LAYER_ID, "line-width", 0.5)
      return
    }

    const fillColor: unknown[] = ["match", ["get", "NAME"]]
    const glowColor: unknown[] = ["match", ["get", "NAME"]]
    const borderColor: unknown[] = ["match", ["get", "NAME"]]
    const borderWidth: unknown[] = ["match", ["get", "NAME"]]
    type Expr = ExpressionSpecification

    for (const [name, visual] of active) {
      fillColor.push(name, visual.fillColor)
      glowColor.push(name, visual.glowColor)
      borderColor.push(name, visual.borderColor)
      borderWidth.push(name, 3)
    }

    fillColor.push("rgba(0,0,0,0)")
    glowColor.push("rgba(0,0,0,0)")
    borderColor.push("rgba(12, 74, 110, 0.25)")
    borderWidth.push(0.5)

    map.setPaintProperty(FILL_LAYER_ID, "fill-color", fillColor as Expr)
    map.setPaintProperty(GLOW_LAYER_ID, "line-color", glowColor as Expr)
    map.setPaintProperty(BORDER_LAYER_ID, "line-color", borderColor as Expr)
    map.setPaintProperty(BORDER_LAYER_ID, "line-width", borderWidth as Expr)
  }, [map, mode, activeCategories])

  return null
}
