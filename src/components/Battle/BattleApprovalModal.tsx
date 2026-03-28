import { useState } from "react"
import { useBattle } from "../../context/BattleContext"
import { NEIGHBORHOOD_BY_ID } from "../../data/neighborhoods"
import { APPROVAL_OPTIONS } from "../../data/battles"

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function BattleApprovalModal() {
  const { pendingBattle, approveBattle } = useBattle()
  const [extraBtn, setExtraBtn] = useState<string | null>(null)

  if (!pendingBattle) return null

  const { pair } = pendingBattle
  const hoodA = NEIGHBORHOOD_BY_ID.get(pair.neighborhoodA)
  const hoodB = NEIGHBORHOOD_BY_ID.get(pair.neighborhoodB)
  const nameA = hoodA ? titleCase(hoodA.name) : pair.neighborhoodA
  const nameB = hoodB ? titleCase(hoodB.name) : pair.neighborhoodB

  const handleBackdropClick = () => {
    const extras = [
      "You can't escape this",
      "Resistance is futile",
      "Portland demands blood",
      "The crows are watching",
      "Just click a button already",
    ]
    setExtraBtn(extras[Math.floor(Math.random() * extras.length)])
  }

  return (
    <div className="battle-modal-overlay" onClick={handleBackdropClick}>
      <div className="battle-modal" onClick={(e) => e.stopPropagation()}>
        <div className="battle-modal-header">
          <span style={{ fontSize: 28 }}>{"\u2694\uFE0F"}</span>
          <h2>NEIGHBORHOOD WAR DECLARED</h2>
        </div>

        <div className="battle-armies">
          <div className="battle-army">
            <span className="army-emoji">{pair.armyEmojiA}</span>
            <span className="army-name">{nameA}</span>
          </div>
          <span className="battle-vs">VS</span>
          <div className="battle-army">
            <span className="army-emoji">{pair.armyEmojiB}</span>
            <span className="army-name">{nameB}</span>
          </div>
        </div>

        <p className="battle-reason">"{pair.conflictReason}"</p>

        <div className="battle-buttons">
          {APPROVAL_OPTIONS.map((label) => (
            <button
              key={label}
              className="battle-btn"
              onClick={approveBattle}
            >
              {label}
            </button>
          ))}
          {extraBtn && (
            <button className="battle-btn battle-btn-extra" onClick={approveBattle}>
              {extraBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
