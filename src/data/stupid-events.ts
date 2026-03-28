import type { StupidEvent } from "./types"

export const STUPID_EVENTS: readonly StupidEvent[] = [
  // Impervious Surface
  {
    id: "stupid-1",
    title: "Peak Concrete Achievement",
    neighborhoodId: "downtown",
    category: "impervious",
    description: "Downtown has achieved near-total victory over nature. Only 6% of the ground remembers what dirt feels like.",
    metric: "94%",
    metricValue: 0.94,
  },
  {
    id: "stupid-2",
    title: "Parking Lot Paradise",
    neighborhoodId: "lloyd",
    category: "impervious",
    description: "The Convention Center area is basically a love letter to asphalt. Joni Mitchell warned us.",
    metric: "89%",
    metricValue: 0.89,
  },
  {
    id: "stupid-3",
    title: "Artisanal Pavement",
    neighborhoodId: "pearl",
    category: "impervious",
    description: "The most expensive concrete per square foot in Oregon. Each slab was hand-poured by a barista.",
    metric: "82%",
    metricValue: 0.82,
  },

  // Crow Density
  {
    id: "stupid-4",
    title: "The Parliament Convenes",
    neighborhoodId: "east-portland",
    category: "crows",
    description: "The largest murder in the Pacific NW gathers nightly. They've been holding this meeting since before Portland had a city council.",
    metric: "~8K",
    metricValue: 1.0,
  },
  {
    id: "stupid-5",
    title: "The Suburban Caucus",
    neighborhoodId: "sellwood-moreland",
    category: "crows",
    description: "Mid-density crow representation. They're here for the birdseed and the drama.",
    metric: "~3.5K",
    metricValue: 0.44,
  },
  {
    id: "stupid-6",
    title: "Corporate Crows",
    neighborhoodId: "downtown",
    category: "crows",
    description: "Downtown's crow population outnumbers its office workers after 6pm. They also have better attendance.",
    metric: "~5K",
    metricValue: 0.63,
  },

  // Stink Map
  {
    id: "stupid-7",
    title: "The Eternal Egg",
    neighborhoodId: "nw-industrial",
    category: "stink",
    description: "The wastewater treatment plant has been providing this neighborhood with free aromatherapy since 1952.",
    metric: "Sulfur",
    metricValue: 1.0,
  },
  {
    id: "stupid-8",
    title: "Essence of Productivity",
    neighborhoodId: "st-johns",
    category: "stink",
    description: "That smell? That's the smell of the paper industry. Also, occasionally, the actual smell of a paper mill.",
    metric: "Wet Cardboard",
    metricValue: 0.7,
  },
  {
    id: "stupid-9",
    title: "The Unidentified",
    neighborhoodId: "foster-powell",
    category: "stink",
    description: "DEQ has received 47 complaints. Nobody knows what it is. Portland's own X-File.",
    metric: "Mystery",
    metricValue: 0.85,
  },
] satisfies readonly StupidEvent[]
