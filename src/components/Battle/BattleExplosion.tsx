import { useEffect, useState } from "react"
import { BATTLE_CONFIG } from "../../config/constants"

interface BattleExplosionProps {
  readonly screenX: number
  readonly screenY: number
  readonly onComplete: () => void
}

const DEBRIS_EMOJIS = [
  "\u2615", "\uD83D\uDEB2", "\uD83D\uDC26\u200D\u2B1B", "\uD83C\uDF27\uFE0F",
  "\uD83D\uDCBC", "\uD83C\uDF3B", "\uD83C\uDFB8", "\uD83E\uDD84",
  "\uD83D\uDCA5", "\u2B50", "\uD83D\uDD25", "\uD83C\uDF1F",
]

function randomDebris(): { emoji: string; dx: number; dy: number; rotation: number } {
  const angle = Math.random() * 2 * Math.PI
  const distance = 60 + Math.random() * 120
  return {
    emoji: DEBRIS_EMOJIS[Math.floor(Math.random() * DEBRIS_EMOJIS.length)],
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    rotation: Math.random() * 720 - 360,
  }
}

export function BattleExplosion({ screenX, screenY, onComplete }: BattleExplosionProps) {
  const [debris] = useState(() => Array.from({ length: 12 }, randomDebris))
  const [shaking, setShaking] = useState(true)

  useEffect(() => {
    const shakeTimer = setTimeout(() => setShaking(false), 500)
    const timer = setTimeout(onComplete, BATTLE_CONFIG.EXPLOSION_DURATION_MS)
    return () => {
      clearTimeout(timer)
      clearTimeout(shakeTimer)
    }
  }, [onComplete])

  // Apply screen shake to the root
  useEffect(() => {
    if (shaking) {
      document.getElementById("root")?.classList.add("screen-shake")
    }
    return () => {
      document.getElementById("root")?.classList.remove("screen-shake")
    }
  }, [shaking])

  return (
    <div
      className="battle-explosion"
      style={{
        left: screenX,
        top: screenY,
      }}
    >
      {/* Concentric rings */}
      <div className="explosion-ring explosion-ring-1" />
      <div className="explosion-ring explosion-ring-2" />
      <div className="explosion-ring explosion-ring-3" />

      {/* Big boom emoji */}
      <span className="explosion-boom">{"\uD83D\uDCA5"}</span>

      {/* Flying debris */}
      {debris.map((d, i) => (
        <span
          key={i}
          className="explosion-debris"
          style={{
            ["--dx" as string]: `${d.dx}px`,
            ["--dy" as string]: `${d.dy}px`,
            ["--rotation" as string]: `${d.rotation}deg`,
            animationDelay: `${i * 0.03}s`,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  )
}
