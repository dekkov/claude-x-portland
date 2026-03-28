export type AppMode = "sane" | "unhinged"

// Sane mode
export type EventCategory = "political" | "nature" | "culture" | "entertainment" | "music"

export interface CityEvent {
  readonly id: string
  readonly title: string
  readonly venue: string
  readonly time: string
  readonly category: EventCategory
  readonly neighborhoodId: string
  readonly description: string
}

// Unhinged mode
export type StupidCategory = "impervious" | "crows" | "stink"

export interface StupidEvent {
  readonly id: string
  readonly title: string
  readonly neighborhoodId: string
  readonly category: StupidCategory
  readonly description: string
  readonly metric: string
  readonly metricValue: number // 0-1 for glow intensity
}

// Shared
export interface Neighborhood {
  readonly id: string
  readonly name: string         // Must match GeoJSON NAME property
  readonly centroid: [number, number] // [lng, lat]
  readonly vibeEmoji: string
}

export type AnyCategory = EventCategory | StupidCategory

export interface CategoryDef {
  readonly id: string
  readonly label: string
  readonly color: string
  readonly glowColor: string
  readonly emoji: string
}
