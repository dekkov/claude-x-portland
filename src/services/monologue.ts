import OpenAI from "openai"
import type { AppMode } from "../data/types"
import { SANE_EVENTS } from "../data/events"
import { STUPID_EVENTS } from "../data/stupid-events"
import { NEIGHBORHOOD_BY_ID } from "../data/neighborhoods"
import { FALLBACK_MONOLOGUES } from "../config/constants"

const SANE_SYSTEM = `You are Portland, Oregon — the city itself. You're self-aware, wry, and a little too proud of your weirdness. Generate a short internal monologue (2-3 sentences) about what's happening in your neighborhoods today. Reference specific events. Be funny. Channel Portland humor — think Portlandia meets a therapy session.`

const UNHINGED_SYSTEM = `You are Portland, Oregon, and you've been in therapy for 3 years. Today your therapist asked you to describe your neighborhoods using only their concrete coverage percentages, crow populations, and documented stink complaints. You're trying to be honest but you keep making it weird. Generate a 2-3 sentence internal monologue. Be absurd. Reference the actual numbers. Channel the energy of a city that knows way too much about its own crows.`

function buildContext(mode: AppMode, activeCategories: ReadonlySet<string>): string {
  if (mode === "sane") {
    const events = SANE_EVENTS.filter((e) => activeCategories.has(e.category))
    return events
      .map((e) => {
        const hood = NEIGHBORHOOD_BY_ID.get(e.neighborhoodId)
        return `${hood?.name ?? e.neighborhoodId}: "${e.title}" at ${e.venue} (${e.time})`
      })
      .join("\n")
  }

  const events = STUPID_EVENTS.filter((e) => activeCategories.has(e.category))
  return events
    .map((e) => {
      const hood = NEIGHBORHOOD_BY_ID.get(e.neighborhoodId)
      return `${hood?.name ?? e.neighborhoodId}: ${e.title} — ${e.metric} (${e.description})`
    })
    .join("\n")
}

const cache = new Map<string, string>()

export async function generateMonologue(
  mode: AppMode,
  activeCategories: ReadonlySet<string>
): Promise<string> {
  const cacheKey = `${mode}:${Array.from(activeCategories).sort().join(",")}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey || apiKey === "your_openai_key_here") {
    return FALLBACK_MONOLOGUES[mode]
  }

  try {
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Localhost hackathon only
    })

    const context = buildContext(mode, activeCategories)
    if (!context) return FALLBACK_MONOLOGUES[mode]

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: mode === "sane" ? SANE_SYSTEM : UNHINGED_SYSTEM },
        { role: "user", content: `Today's data:\n${context}` },
      ],
      max_tokens: 200,
      temperature: 0.9,
    })

    const text = response.choices[0]?.message?.content ?? FALLBACK_MONOLOGUES[mode]
    cache.set(cacheKey, text)
    return text
  } catch {
    return FALLBACK_MONOLOGUES[mode]
  }
}
