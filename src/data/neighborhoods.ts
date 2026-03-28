import type { Neighborhood } from "./types"

// Neighborhood IDs mapped to GeoJSON NAME property values
// Centroids are approximate; will be overridden by @turf/centroid from GeoJSON when available
export const NEIGHBORHOODS: readonly Neighborhood[] = [
  {
    id: "downtown",
    name: "DOWNTOWN",
    centroid: [-122.6795, 45.5189],
    vibeEmoji: "\uD83C\uDFD9\uFE0F",
  },
  {
    id: "east-portland",
    name: "CENTENNIAL", // East Portland area
    centroid: [-122.5060, 45.4920],
    vibeEmoji: "\uD83C\uDF33",
  },
  {
    id: "boise",
    name: "BOISE",
    centroid: [-122.6730, 45.5490],
    vibeEmoji: "\uD83D\uDCDA",
  },
  {
    id: "buckman",
    name: "BUCKMAN",
    centroid: [-122.6530, 45.5150],
    vibeEmoji: "\uD83C\uDF7E",
  },
  {
    id: "hosford-abernethy",
    name: "HOSFORD-ABERNETHY",
    centroid: [-122.6490, 45.5050],
    vibeEmoji: "\uD83C\uDFB8",
  },
  {
    id: "lloyd",
    name: "LLOYD DISTRICT",
    centroid: [-122.6580, 45.5310],
    vibeEmoji: "\uD83C\uDFEA",
  },
  {
    id: "pearl",
    name: "PEARL",
    centroid: [-122.6830, 45.5310],
    vibeEmoji: "\u2615",
  },
  {
    id: "sellwood-moreland",
    name: "SELLWOOD-MORELAND",
    centroid: [-122.6530, 45.4700],
    vibeEmoji: "\uD83E\uDDA4",
  },
  {
    id: "nw-industrial",
    name: "NORTHWEST INDUSTRIAL",
    centroid: [-122.7150, 45.5400],
    vibeEmoji: "\uD83C\uDFED",
  },
  {
    id: "st-johns",
    name: "ST. JOHNS",
    centroid: [-122.7540, 45.5900],
    vibeEmoji: "\uD83C\uDF09",
  },
  {
    id: "foster-powell",
    name: "FOSTER-POWELL",
    centroid: [-122.6180, 45.4900],
    vibeEmoji: "\uD83D\uDC7D",
  },
] as const

export const NEIGHBORHOOD_BY_ID = new Map(
  NEIGHBORHOODS.map((n) => [n.id, n])
)

export const NEIGHBORHOOD_BY_NAME = new Map(
  NEIGHBORHOODS.map((n) => [n.name, n])
)
