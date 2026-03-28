import { useCallback, useEffect, useRef, useState } from "react"
import type mapboxgl from "mapbox-gl"
import { useBattle } from "../../context/BattleContext"
import { useBattleTimer } from "../../hooks/useBattleTimer"
import { fetchBattleRoute } from "../../hooks/useBattleRoute"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { generateBattleCommentary } from "../../services/battle-commentary"
import { BattleApprovalModal } from "./BattleApprovalModal"
import { BattleTroopAnimator } from "./BattleTroopAnimator"
import { BattleExplosion } from "./BattleExplosion"
import { BattleResultBanner } from "./BattleResultBanner"

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function BattleManager({ map }: { map: mapboxgl.Map }) {
  const battle = useBattle()
  const battleRef = useRef(battle)
  battleRef.current = battle

  const { activeBattle } = battle
  const [route, setRoute] = useState<GeoJSON.LineString | null>(null)
  const [showTroops, setShowTroops] = useState(false)
  const [explosionPos, setExplosionPos] = useState<{ x: number; y: number } | null>(null)
  const fetchingRef = useRef(false)

  useBattleTimer()

  // Fetch route when battle is approved
  useEffect(() => {
    if (activeBattle?.state !== "approved" || fetchingRef.current) return
    fetchingRef.current = true

    const hoodA = NEIGHBORHOOD_BY_ID.get(activeBattle.pair.neighborhoodA)
    const hoodB = NEIGHBORHOOD_BY_ID.get(activeBattle.pair.neighborhoodB)
    if (!hoodA || !hoodB) { fetchingRef.current = false; return }

    fetchBattleRoute(hoodA.centroid, hoodB.centroid).then((r) => {
      setRoute(r)
      setShowTroops(true)
      battleRef.current.updateBattleState("marching", { route: r })
    })
  }, [activeBattle?.state, activeBattle?.id])

  // Reset when battle ends
  useEffect(() => {
    if (!activeBattle) {
      setRoute(null)
      setShowTroops(false)
      fetchingRef.current = false
    }
  }, [activeBattle])

  // Stable collision handler — no activeBattle in deps
  const handleCollision = useCallback(
    (midpoint: [number, number]) => {
      const screenPt = map.project(midpoint)
      setExplosionPos({ x: screenPt.x, y: screenPt.y })
      setShowTroops(false)
      battleRef.current.updateBattleState("colliding")
    },
    [map]
  )

  const handleExplosionComplete = useCallback(async () => {
    setExplosionPos(null)
    const current = battleRef.current.activeBattle
    if (!current) return

    const { pair } = current
    const winnerId = Math.random() > 0.5 ? pair.neighborhoodA : pair.neighborhoodB
    const loserId = winnerId === pair.neighborhoodA ? pair.neighborhoodB : pair.neighborhoodA

    const hoodA = NEIGHBORHOOD_BY_ID.get(pair.neighborhoodA)
    const hoodB = NEIGHBORHOOD_BY_ID.get(pair.neighborhoodB)
    const nameA = hoodA ? titleCase(hoodA.name) : pair.neighborhoodA
    const nameB = hoodB ? titleCase(hoodB.name) : pair.neighborhoodB
    const winnerName = winnerId === pair.neighborhoodA ? nameA : nameB

    const commentary = await generateBattleCommentary(
      nameA, nameB, pair.conflictReason, winnerName, pair.armyEmojiA, pair.armyEmojiB
    )

    setRoute(null)
    battleRef.current.resolveBattle(winnerId, loserId, commentary)
  }, [])

  return (
    <>
      <BattleApprovalModal />

      {showTroops && route && activeBattle && (
        <BattleTroopAnimator
          map={map}
          route={route}
          battleId={activeBattle.id}
          armyEmojiA={activeBattle.pair.armyEmojiA}
          armyEmojiB={activeBattle.pair.armyEmojiB}
          onCollision={handleCollision}
        />
      )}

      {explosionPos && (
        <BattleExplosion
          screenX={explosionPos.x}
          screenY={explosionPos.y}
          onComplete={handleExplosionComplete}
        />
      )}

      <BattleResultBanner />
    </>
  )
}
