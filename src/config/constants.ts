import type { CategoryDef } from "../data/types"

export const MAP_CONFIG = {
  center: [-122.6765, 45.5231] as [number, number],
  zoom: 12,
  pitch: 60,
  bearing: -15,
  style: "mapbox://styles/mapbox/standard",
} as const

export const SANE_CATEGORIES: readonly CategoryDef[] = [
  { id: "political", label: "Political", color: "#FF3B5C", glowColor: "#FF3B5C", emoji: "\u270A" },
  { id: "nature", label: "Nature", color: "#4ADE80", glowColor: "#4ADE80", emoji: "\uD83C\uDF32" },
  { id: "culture", label: "Culture", color: "#A78BFA", glowColor: "#A78BFA", emoji: "\uD83D\uDCDA" },
  { id: "entertainment", label: "Entertainment", color: "#FB923C", glowColor: "#FB923C", emoji: "\uD83C\uDFAD" },
  { id: "music", label: "Music", color: "#38BDF8", glowColor: "#38BDF8", emoji: "\uD83C\uDFB5" },
] as const

export const STUPID_CATEGORIES: readonly CategoryDef[] = [
  { id: "impervious", label: "Pavement Pride", color: "#94A3B8", glowColor: "#CBD5E1", emoji: "\uD83C\uDD7F\uFE0F" },
  { id: "crows", label: "Murder Report", color: "#8B5CF6", glowColor: "#A78BFA", emoji: "\uD83D\uDC26\u200D\u2B1B" },
  { id: "stink", label: "Stink Check", color: "#84CC16", glowColor: "#A3E635", emoji: "\uD83E\uDD22" },
] as const

export const CATEGORY_MAP: Record<string, CategoryDef> = Object.fromEntries(
  [...SANE_CATEGORIES, ...STUPID_CATEGORIES].map((c) => [c.id, c])
)

export const FALLBACK_MONOLOGUES = {
  sane: "I'm having a moment. Half of me is protesting downtown while the other half is sipping artisanal coffee and applauding Ira Glass. This is fine. This is Portland.",
  unhinged: "I can't stop thinking about how Downtown is 94% concrete and somehow that's my most 'developed' personality trait. Meanwhile 8,000 crows hold nightly meetings in East Portland and honestly? Their governance structure is more functional than my city council.",
} as const
