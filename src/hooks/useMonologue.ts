import { useState, useEffect, useRef } from "react"
import { useAppState } from "../context/AppContext"
import { generateMonologue } from "../services/monologue"
import { FALLBACK_MONOLOGUES } from "../config/constants"

export function useMonologue() {
  const { mode, activeCategories } = useAppState()
  const [text, setText] = useState(FALLBACK_MONOLOGUES.unhinged)
  const [isLoading, setIsLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setIsLoading(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const result = await generateMonologue(mode, activeCategories)
      setText(result)
      setIsLoading(false)
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [mode, activeCategories])

  return { text, isLoading }
}
