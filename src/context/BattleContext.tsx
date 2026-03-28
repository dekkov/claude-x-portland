import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type { Battle, BattlePair, BattleResult, BattleState } from "../data/battle-types"
import { BATTLE_PAIRS } from "../data/battles"

interface BattleContextValue {
  readonly pendingBattle: Battle | null
  readonly activeBattle: Battle | null
  readonly latestResult: BattleResult | null
  readonly battleCount: number
  readonly queueBattle: (pair: BattlePair) => void
  readonly approveBattle: () => void
  readonly updateBattleState: (state: BattleState, updates?: Partial<Battle>) => void
  readonly resolveBattle: (winnerId: string, loserId: string, commentary: string) => void
  readonly dismissResult: () => void
  readonly triggerRandomBattle: () => void
}

const BattleCtx = createContext<BattleContextValue | null>(null)

let battleIdCounter = 0
const recentPairKeys = new Set<string>()

function pairKey(pair: BattlePair): string {
  return [pair.neighborhoodA, pair.neighborhoodB].sort().join(":")
}

export function BattleProvider({ children }: { children: ReactNode }) {
  const [pendingBattle, setPending] = useState<Battle | null>(null)
  const [activeBattle, setActive] = useState<Battle | null>(null)
  const [latestResult, setLatestResult] = useState<BattleResult | null>(null)
  const [battleCount, setBattleCount] = useState(0)

  const queueBattle = useCallback((pair: BattlePair) => {
    setPending({
      id: `battle-${++battleIdCounter}`,
      pair,
      state: "pending",
    })
  }, [])

  const approveBattle = useCallback(() => {
    setPending((prev) => {
      if (!prev) return null
      setActive({ ...prev, state: "approved" })
      return null
    })
  }, [])

  const updateBattleState = useCallback((state: BattleState, updates?: Partial<Battle>) => {
    setActive((prev) => {
      if (!prev) return null
      return { ...prev, ...updates, state }
    })
  }, [])

  const resolveBattle = useCallback((winnerId: string, loserId: string, commentary: string) => {
    setActive((prev) => {
      if (!prev) return null
      setLatestResult({
        battleId: prev.id,
        winner: winnerId,
        loser: loserId,
        commentary,
        pair: prev.pair,
      })
      setBattleCount((c) => c + 1)
      recentPairKeys.add(pairKey(prev.pair))
      if (recentPairKeys.size > 5) {
        const first = recentPairKeys.values().next().value
        if (first) recentPairKeys.delete(first)
      }
      return null
    })
  }, [])

  const dismissResult = useCallback(() => {
    setLatestResult(null)
  }, [])

  const triggerRandomBattle = useCallback(() => {
    const available = BATTLE_PAIRS.filter((p) => !recentPairKeys.has(pairKey(p)))
    const pool = available.length > 0 ? available : BATTLE_PAIRS
    const pair = pool[Math.floor(Math.random() * pool.length)]
    queueBattle(pair)
  }, [queueBattle])

  const value = useMemo<BattleContextValue>(
    () => ({
      pendingBattle,
      activeBattle,
      latestResult,
      battleCount,
      queueBattle,
      approveBattle,
      updateBattleState,
      resolveBattle,
      dismissResult,
      triggerRandomBattle,
    }),
    [pendingBattle, activeBattle, latestResult, battleCount, queueBattle, approveBattle, updateBattleState, resolveBattle, dismissResult, triggerRandomBattle]
  )

  return <BattleCtx.Provider value={value}>{children}</BattleCtx.Provider>
}

export function useBattle(): BattleContextValue {
  const ctx = useContext(BattleCtx)
  if (!ctx) throw new Error("useBattle must be used within BattleProvider")
  return ctx
}
