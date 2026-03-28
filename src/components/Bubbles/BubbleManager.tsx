import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { useAppState } from "../../context/AppContext"
import { SANE_EVENTS } from "../../data/events"
import { STUPID_EVENTS } from "../../data/stupid-events"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { CATEGORY_MAP } from "../../config/constants"
import type { CityEvent, StupidEvent, Neighborhood } from "../../data/types"

interface BubbleData {
  readonly neighborhood: Neighborhood
  readonly color: string
  readonly emoji: string
  readonly badge: string
  readonly events: readonly CityEvent[]
  readonly stupidEvents: readonly StupidEvent[]
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function getActiveBubbles(
  mode: "sane" | "unhinged",
  activeCategories: ReadonlySet<string>
): readonly BubbleData[] {
  const bubbleMap = new Map<string, BubbleData>()

  if (mode === "sane") {
    for (const evt of SANE_EVENTS) {
      if (!activeCategories.has(evt.category)) continue
      const hood = NEIGHBORHOOD_BY_ID.get(evt.neighborhoodId)
      if (!hood) continue
      const cat = CATEGORY_MAP[evt.category]
      if (!cat) continue

      const existing = bubbleMap.get(hood.id)
      if (existing) {
        bubbleMap.set(hood.id, {
          ...existing,
          events: [...existing.events, evt],
          badge: `${existing.events.length + 1}`,
        })
      } else {
        bubbleMap.set(hood.id, {
          neighborhood: hood,
          color: cat.color,
          emoji: cat.emoji,
          badge: "1",
          events: [evt],
          stupidEvents: [],
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

      const existing = bubbleMap.get(hood.id)
      if (!existing) {
        bubbleMap.set(hood.id, {
          neighborhood: hood,
          color: cat.color,
          emoji: cat.emoji,
          badge: evt.metric,
          events: [],
          stupidEvents: [evt],
        })
      } else {
        bubbleMap.set(hood.id, {
          ...existing,
          stupidEvents: [...existing.stupidEvents, evt],
        })
      }
    }
  }

  return Array.from(bubbleMap.values())
}

function createBubbleHTML(bubble: BubbleData, delay: number): string {
  return `
    <div class="bubble-marker" style="animation-delay: ${delay}s; color: ${bubble.color}">
      <div class="bubble-inner">
        <span class="bubble-emoji">${bubble.emoji}</span>
        <span class="bubble-badge">${bubble.badge}</span>
      </div>
    </div>
  `
}

function createExpandedHTML(bubble: BubbleData, mode: "sane" | "unhinged"): string {
  const hoodName = titleCase(bubble.neighborhood.name)

  if (mode === "sane") {
    const eventList = bubble.events
      .map(
        (e) => `
        <div class="event-item">
          <div><strong><a href="#" class="event-link" data-lng="${e.location[0]}" data-lat="${e.location[1]}" style="color: inherit; text-decoration: underline; text-decoration-style: dotted; cursor: pointer;">${e.title}</a></strong></div>
          <div class="event-time">${e.time}</div>
          <div class="event-venue">${e.venue}</div>
        </div>`
      )
      .join("")
    return `
      <div class="bubble-expanded">
        <button class="close-btn" data-close="true">&times;</button>
        <h3>${bubble.emoji} ${hoodName}</h3>
        ${eventList}
      </div>
    `
  }

  const evt = bubble.stupidEvents[0]
  if (!evt) return ""
  return `
    <div class="bubble-expanded">
      <button class="close-btn" data-close="true">&times;</button>
      <h3>${bubble.emoji} ${hoodName}</h3>
      <div class="metric-big" style="color: ${bubble.color}">${evt.metric}</div>
      <div class="description">${evt.description}</div>
      ${evt.category === "stink" ? '<div style="margin-top:8px;font-size:11px;color:var(--text-secondary)">Smell-O-Vision Rating: 3/5 dumpsters</div>' : ""}
    </div>
  `
}

export function BubbleManager({ map }: { map: mapboxgl.Map }) {
  const { mode, activeCategories, selectedNeighborhood, setSelectedNeighborhood } = useAppState()
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const expandedRef = useRef<HTMLDivElement | null>(null)

  // Clean up expanded card
  const closeExpanded = () => {
    if (expandedRef.current) {
      expandedRef.current.remove()
      expandedRef.current = null
    }
    setSelectedNeighborhood(null)
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeExpanded()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  // Close on map click
  useEffect(() => {
    const handler = () => closeExpanded()
    map.on("click", handler)
    return () => { map.off("click", handler) }
  }, [map])

  // Sync markers with state
  useEffect(() => {
    const bubbles = getActiveBubbles(mode, activeCategories)
    const currentIds = new Set(bubbles.map((b) => b.neighborhood.id))

    // Remove old markers
    for (const [id, marker] of markersRef.current) {
      if (!currentIds.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    }

    // Add/update markers
    bubbles.forEach((bubble, i) => {
      const id = bubble.neighborhood.id
      const existing = markersRef.current.get(id)
      if (existing) {
        existing.remove()
        markersRef.current.delete(id)
      }

      const el = document.createElement("div")
      el.innerHTML = createBubbleHTML(bubble, i * 0.3)
      el.addEventListener("click", (e) => {
        e.stopPropagation()
        closeExpanded()

        // Fly to neighborhood — close enough to see buildings
        map.flyTo({
          center: bubble.neighborhood.centroid,
          zoom: 16,
          pitch: 65,
          bearing: -20 + Math.random() * 40,
          duration: 1500,
        })

        // Show expanded card
        const expanded = document.createElement("div")
        expanded.innerHTML = createExpandedHTML(bubble, mode)
        expanded.addEventListener("click", (e) => {
          const target = e.target as HTMLElement
          if (target.dataset.close) {
            closeExpanded()
          }
          // Click on event name → fly to exact venue location
          if (target.dataset.lng && target.dataset.lat) {
            e.preventDefault()
            e.stopPropagation()
            map.flyTo({
              center: [parseFloat(target.dataset.lng), parseFloat(target.dataset.lat)],
              zoom: 17.5,
              pitch: 70,
              bearing: Math.random() * 30 - 15,
              duration: 1200,
            })
          }
        })
        el.appendChild(expanded)
        expandedRef.current = expanded

        setSelectedNeighborhood(id)
      })

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom", offset: [0, 0] })
        .setLngLat(bubble.neighborhood.centroid)
        .addTo(map)

      markersRef.current.set(id, marker)
    })

    // Cleanup
    return () => {
      // Don't remove on cleanup — we manage lifecycle above
    }
  }, [mode, activeCategories, map])

  // Close expanded when mode/categories change
  useEffect(() => {
    closeExpanded()
  }, [mode, activeCategories])

  return null
}
