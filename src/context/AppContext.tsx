import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type { AppMode } from "../data/types"
import { SANE_CATEGORIES, STUPID_CATEGORIES } from "../config/constants"

interface AppState {
  readonly mode: AppMode
  readonly activeCategories: ReadonlySet<string>
  readonly selectedNeighborhood: string | null
  readonly toggleMode: () => void
  readonly toggleCategory: (id: string) => void
  readonly setSelectedNeighborhood: (id: string | null) => void
  readonly categories: readonly { readonly id: string; readonly label: string; readonly color: string; readonly glowColor: string; readonly emoji: string }[]
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>("unhinged")
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set()
  )
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "sane" ? "unhinged" : "sane"
      setActiveCategories(new Set())
      setSelectedNeighborhood(null)
      return next
    })
  }, [])

  const toggleCategory = useCallback((id: string) => {
    setActiveCategories((prev) => {
      if (prev.has(id)) {
        return new Set()
      }
      return new Set([id])
    })
  }, [])

  const categories = mode === "sane" ? SANE_CATEGORIES : STUPID_CATEGORIES

  const value = useMemo<AppState>(
    () => ({
      mode,
      activeCategories,
      selectedNeighborhood,
      toggleMode,
      toggleCategory,
      setSelectedNeighborhood,
      categories,
    }),
    [mode, activeCategories, selectedNeighborhood, toggleMode, toggleCategory, categories]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
