import { useRef } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapbox } from "./hooks/useMapbox"
import { NeighborhoodLayer } from "./NeighborhoodLayer"
import { BubbleManager } from "../Bubbles/BubbleManager"
import { NeighborhoodFilter } from "../UI/NeighborhoodFilter"
import { BattleManager } from "../Battle/BattleManager"

export function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { map, loaded } = useMapbox(containerRef)

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {map && loaded && (
        <>
          <NeighborhoodLayer map={map} />
          <BubbleManager map={map} />
          <NeighborhoodFilter map={map} />
          <BattleManager map={map} />
        </>
      )}
    </div>
  )
}
