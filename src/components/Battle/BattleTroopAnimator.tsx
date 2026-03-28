import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import along from "@turf/along"
import length from "@turf/length"
import type { Feature, LineString } from "geojson"
import { BATTLE_CONFIG } from "../../config/constants"

interface TroopAnimatorProps {
  readonly map: mapboxgl.Map
  readonly route: GeoJSON.LineString
  readonly battleId: string
  readonly armyEmojiA: string
  readonly armyEmojiB: string
  readonly onCollision: (midpoint: [number, number]) => void
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function createTroopEl(emoji: string, index: number, side: "a" | "b"): HTMLDivElement {
  const el = document.createElement("div")
  const borderColor = side === "a" ? "rgba(68, 138, 255, 0.8)" : "rgba(255, 68, 68, 0.8)"
  const glowColor = side === "a" ? "rgba(68, 138, 255, 0.4)" : "rgba(255, 68, 68, 0.4)"
  el.style.cssText = `
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    line-height: 1;
    background: rgba(15, 10, 26, 0.8);
    border-radius: 50%;
    border: 2px solid ${borderColor};
    box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 14px ${glowColor};
    pointer-events: none;
  `
  el.textContent = emoji
  return el
}

export function BattleTroopAnimator({
  map,
  route,
  battleId,
  armyEmojiA,
  armyEmojiB,
  onCollision,
}: TroopAnimatorProps) {
  const cancelledRef = useRef(false)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const routeSourceId = `battle-route-${battleId}`
  const routeLayerId = `battle-route-line-${battleId}`

  useEffect(() => {
    cancelledRef.current = false

    const routeFeature: Feature<LineString> = {
      type: "Feature",
      properties: {},
      geometry: route,
    }
    const totalLength = length(routeFeature, { units: "kilometers" })
    const halfLength = totalLength / 2

    // Add route line to map
    if (!map.getSource(routeSourceId)) {
      map.addSource(routeSourceId, {
        type: "geojson",
        data: routeFeature,
      })
      map.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeSourceId,
        paint: {
          "line-color": "#FF4444",
          "line-width": 3,
          "line-dasharray": [2, 2],
          "line-opacity": 0.7,
        },
      })
    }

    // Create troop markers
    const troopsA: mapboxgl.Marker[] = []
    const troopsB: mapboxgl.Marker[] = []

    for (let i = 0; i < BATTLE_CONFIG.TROOPS_PER_ARMY; i++) {
      const elA = createTroopEl(armyEmojiA, i, "a")
      const elB = createTroopEl(armyEmojiB, i, "b")

      const startA = along(routeFeature, 0, { units: "kilometers" })
      const startB = along(routeFeature, totalLength, { units: "kilometers" })

      const markerA = new mapboxgl.Marker({ element: elA, anchor: "center" })
        .setLngLat(startA.geometry.coordinates as [number, number])
        .addTo(map)
      const markerB = new mapboxgl.Marker({ element: elB, anchor: "center" })
        .setLngLat(startB.geometry.coordinates as [number, number])
        .addTo(map)

      troopsA.push(markerA)
      troopsB.push(markerB)
      markersRef.current.push(markerA, markerB)
    }

    // Calculate camera to fit the entire route so troops are visible
    const startCoord = route.coordinates[0] as [number, number]
    const endCoord = route.coordinates[route.coordinates.length - 1] as [number, number]
    const midLng = (startCoord[0] + endCoord[0]) / 2
    const midLat = (startCoord[1] + endCoord[1]) / 2
    const routeBearing = Math.atan2(endCoord[0] - startCoord[0], endCoord[1] - startCoord[1]) * (180 / Math.PI)

    // Compute bounds from route coordinates to determine zoom that shows both armies
    const bounds = new mapboxgl.LngLatBounds(startCoord, endCoord)
    for (const coord of route.coordinates) {
      bounds.extend(coord as [number, number])
    }

    const fittedCamera = map.cameraForBounds(bounds, {
      padding: 100,
      pitch: 55,
      bearing: routeBearing,
    })
    const startZoom = fittedCamera?.zoom != null ? Math.min(fittedCamera.zoom, 15) : 13
    const endZoom = startZoom + 2

    map.flyTo({
      center: [midLng, midLat],
      zoom: startZoom,
      pitch: 55,
      bearing: routeBearing,
      duration: 2000,
    })

    // Animation loop — starts after camera fly-in
    const startTime = performance.now() + 2000 // wait for fly-in
    let animFrame: number
    let lastCameraUpdate = 0

    function animate(now: number) {
      if (cancelledRef.current) return

      const elapsed = now - startTime
      if (elapsed < 0) {
        // Still flying in, wait
        animFrame = requestAnimationFrame(animate)
        return
      }

      const rawProgress = Math.min(elapsed / BATTLE_CONFIG.MARCH_DURATION_MS, 1)
      const progress = easeInOutCubic(rawProgress)

      // Move Army A forward from start
      let leaderACoord: [number, number] = startCoord
      for (let i = 0; i < troopsA.length; i++) {
        const stagger = i * BATTLE_CONFIG.TROOP_STAGGER_DISTANCE
        const dist = Math.max(0, progress * halfLength - stagger)
        const pt = along(routeFeature, Math.min(dist, totalLength), { units: "kilometers" })
        const coord = pt.geometry.coordinates as [number, number]
        troopsA[i].setLngLat(coord)
        if (i === 0) leaderACoord = coord
      }

      // Move Army B backward from end
      let leaderBCoord: [number, number] = endCoord
      for (let i = 0; i < troopsB.length; i++) {
        const stagger = i * BATTLE_CONFIG.TROOP_STAGGER_DISTANCE
        const dist = Math.max(0, totalLength - progress * halfLength + stagger)
        const pt = along(routeFeature, Math.min(Math.max(dist, 0), totalLength), { units: "kilometers" })
        const coord = pt.geometry.coordinates as [number, number]
        troopsB[i].setLngLat(coord)
        if (i === 0) leaderBCoord = coord
      }

      // Smooth camera follow — track midpoint between the two leaders
      if (now - lastCameraUpdate > 200) {
        lastCameraUpdate = now
        const camLng = (leaderACoord[0] + leaderBCoord[0]) / 2
        const camLat = (leaderACoord[1] + leaderBCoord[1]) / 2
        // Zoom in as armies converge, pitch increases for dramatic close-up
        const zoomLevel = startZoom + progress * (endZoom - startZoom)
        const pitchLevel = 55 + progress * 10
        map.easeTo({
          center: [camLng, camLat],
          zoom: zoomLevel,
          pitch: pitchLevel,
          duration: 300,
        })
      }

      if (rawProgress >= 1) {
        // Collision at midpoint
        const midPt = along(routeFeature, halfLength, { units: "kilometers" })
        onCollision(midPt.geometry.coordinates as [number, number])
        return
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)

    return () => {
      cancelledRef.current = true
      cancelAnimationFrame(animFrame)
      // Clean up markers
      for (const m of markersRef.current) {
        m.remove()
      }
      markersRef.current = []
      // Clean up route layer/source
      if (map.getLayer(routeLayerId)) map.removeLayer(routeLayerId)
      if (map.getSource(routeSourceId)) map.removeSource(routeSourceId)
    }
  }, [map, route, battleId, armyEmojiA, armyEmojiB, onCollision])

  return null
}
