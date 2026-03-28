import OpenAI from "openai"
import { FALLBACK_COMMENTARIES } from "../data/battles"

const BATTLE_SYSTEM = `You are a dramatic war correspondent embedded in Portland, Oregon. Two neighborhoods have just gone to war. Narrate the outcome in 2-3 sentences. Be absurd. Reference the neighborhoods by name, their army types, and the conflict reason. Channel the energy of a local news anchor who has completely lost it.`

const cache = new Map<string, string>()

export async function generateBattleCommentary(
  neighborhoodA: string,
  neighborhoodB: string,
  conflictReason: string,
  winner: string,
  armyEmojiA: string,
  armyEmojiB: string
): Promise<string> {
  const cacheKey = `${neighborhoodA}:${neighborhoodB}:${winner}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey || apiKey === "your_openai_key_here") {
    return FALLBACK_COMMENTARIES[Math.floor(Math.random() * FALLBACK_COMMENTARIES.length)]
  }

  try {
    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: BATTLE_SYSTEM },
        {
          role: "user",
          content: `Battle: ${neighborhoodA} (army: ${armyEmojiA}) vs ${neighborhoodB} (army: ${armyEmojiB})\nConflict: ${conflictReason}\nWinner: ${winner}`,
        },
      ],
      max_tokens: 150,
      temperature: 1.0,
    })

    const text =
      response.choices[0]?.message?.content ??
      FALLBACK_COMMENTARIES[Math.floor(Math.random() * FALLBACK_COMMENTARIES.length)]
    cache.set(cacheKey, text)
    return text
  } catch {
    return FALLBACK_COMMENTARIES[Math.floor(Math.random() * FALLBACK_COMMENTARIES.length)]
  }
}
