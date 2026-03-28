import { useEffect } from "react"
import { useBattle } from "../../context/BattleContext"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { BATTLE_CONFIG } from "../../config/constants"

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function BattleResultBanner() {
  const { latestResult, dismissResult } = useBattle()

  useEffect(() => {
    if (!latestResult) return
    const timer = setTimeout(dismissResult, BATTLE_CONFIG.RESULT_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [latestResult, dismissResult])

  if (!latestResult) return null

  const winnerHood = NEIGHBORHOOD_BY_ID.get(latestResult.winner)
  const winnerName = winnerHood ? titleCase(winnerHood.name) : latestResult.winner
  const winnerEmoji = winnerHood?.vibeEmoji ?? "\uD83C\uDFC6"

  return (
    <div className="battle-result-overlay" onClick={dismissResult}>
      <div className="battle-result">
        <div className="result-trophy">{"\uD83C\uDFC6"}</div>
        <h2 className="result-winner">
          {winnerEmoji} {winnerName} VICTORIOUS {winnerEmoji}
        </h2>
        <p className="result-commentary">{latestResult.commentary}</p>
        <span className="result-dismiss">click to dismiss</span>
      </div>
    </div>
  )
}
