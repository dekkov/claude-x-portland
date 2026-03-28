import { useEffect, useRef, useCallback } from "react"
import { useBattle } from "../context/BattleContext"
import { BATTLE_CONFIG } from "../config/constants"

export function useBattleTimer() {
  const { pendingBattle, activeBattle, triggerRandomBattle } = useBattle()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const delay =
      BATTLE_CONFIG.BATTLE_INTERVAL_MIN_MS +
      Math.random() * (BATTLE_CONFIG.BATTLE_INTERVAL_MAX_MS - BATTLE_CONFIG.BATTLE_INTERVAL_MIN_MS)
    timerRef.current = setTimeout(() => {
      triggerRandomBattle()
    }, delay)
  }, [triggerRandomBattle])

  useEffect(() => {
    // Only auto-trigger if no battle is active or pending
    if (!pendingBattle && !activeBattle) {
      scheduleNext()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pendingBattle, activeBattle, scheduleNext])

  return { triggerNow: triggerRandomBattle }
}
