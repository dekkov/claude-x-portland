import { useMemo } from "react"
import type { Map as MapboxMap } from "mapbox-gl"
import { useAppState } from "../../context/AppContext"
import { SANE_EVENTS } from "../../data/events"
import { STUPID_EVENTS } from "../../data/stupid-events"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import type { Neighborhood } from "../../data/types"

function getActiveNeighborhoodList(
  mode: "sane" | "unhinged",
  activeCategories: ReadonlySet<string>
): readonly Neighborhood[] {
  const seen = new Set<string>()
  const result: Neighborhood[] = []
  const events = mode === "sane" ? SANE_EVENTS : STUPID_EVENTS

  for (const evt of events) {
    if (!activeCategories.has(evt.category)) continue
    if (seen.has(evt.neighborhoodId)) continue
    const hood = NEIGHBORHOOD_BY_ID.get(evt.neighborhoodId)
    if (!hood) continue
    seen.add(hood.id)
    result.push(hood)
  }

  return result
}

export function NeighborhoodFilter({ map }: { map: MapboxMap }) {
  const { mode, activeCategories, selectedNeighborhood, setSelectedNeighborhood } = useAppState()

  const neighborhoods = useMemo(
    () => getActiveNeighborhoodList(mode, activeCategories),
    [mode, activeCategories]
  )

  if (neighborhoods.length === 0) return null

  const handleClick = (hood: Neighborhood) => {
    setSelectedNeighborhood(hood.id)
    map.flyTo({
      center: hood.centroid,
      zoom: 14,
      pitch: 65,
      bearing: -20 + Math.random() * 40,
      duration: 1500,
    })
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        zIndex: 100,
        padding: "8px 10px",
        background: "rgba(15, 10, 26, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: 1,
          padding: "2px 6px 4px",
        }}
      >
        Neighborhoods
      </div>
      {neighborhoods.map((hood) => {
        const isSelected = selectedNeighborhood === hood.id
        return (
          <button
            key={hood.id}
            onClick={() => handleClick(hood)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 10,
              border: isSelected
                ? "1px solid rgba(255, 255, 255, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              background: isSelected ? "rgba(255, 255, 255, 0.15)" : "transparent",
              color: isSelected ? "white" : "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: 600,
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              textAlign: "left",
            }}
          >
            <span>{hood.vibeEmoji}</span>
            <span>
              {hood.id
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </span>
          </button>
        )
      })}
    </div>
  )
}
