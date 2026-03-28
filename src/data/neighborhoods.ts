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
    name: "CENTENNIAL",
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
  {
    id: "alberta",
    name: "CONCORDIA",
    centroid: [-122.6430, 45.5590],
    vibeEmoji: "\uD83C\uDFA8",
  },
  {
    id: "hawthorne",
    name: "RICHMOND",
    centroid: [-122.6340, 45.5120],
    vibeEmoji: "\uD83C\uDF3B",
  },
  {
    id: "mississippi",
    name: "HUMBOLDT",
    centroid: [-122.6750, 45.5530],
    vibeEmoji: "\uD83C\uDFB6",
  },
  {
    id: "irvington",
    name: "IRVINGTON",
    centroid: [-122.6540, 45.5390],
    vibeEmoji: "\uD83C\uDFDB\uFE0F",
  },
  {
    id: "kenton",
    name: "KENTON",
    centroid: [-122.6930, 45.5830],
    vibeEmoji: "\uD83E\uDD84",
  },
  {
    id: "montavilla",
    name: "MONTAVILLA",
    centroid: [-122.5740, 45.5140],
    vibeEmoji: "\uD83C\uDF7A",
  },
  {
    id: "sunnyside",
    name: "SUNNYSIDE",
    centroid: [-122.6480, 45.5120],
    vibeEmoji: "\u2600\uFE0F",
  },
  {
    id: "woodstock",
    name: "WOODSTOCK",
    centroid: [-122.6130, 45.4790],
    vibeEmoji: "\uD83C\uDFB5",
  },
  {
    id: "overlook",
    name: "OVERLOOK",
    centroid: [-122.6850, 45.5630],
    vibeEmoji: "\uD83C\uDF05",
  },
  {
    id: "cully",
    name: "CULLY",
    centroid: [-122.5770, 45.5590],
    vibeEmoji: "\uD83C\uDF3E",
  },
  {
    id: "lents",
    name: "LENTS",
    centroid: [-122.5690, 45.4810],
    vibeEmoji: "\uD83C\uDF31",
  },
  {
    id: "goose-hollow",
    name: "GOOSE HOLLOW",
    centroid: [-122.6920, 45.5190],
    vibeEmoji: "\u26BD",
  },
  {
    id: "northwest",
    name: "NORTHWEST DISTRICT",
    centroid: [-122.6960, 45.5340],
    vibeEmoji: "\uD83D\uDED2",
  },
  {
    id: "old-town",
    name: "OLD TOWN/CHINATOWN",
    centroid: [-122.6720, 45.5250],
    vibeEmoji: "\uD83C\uDFEE",
  },
  {
    id: "mt-tabor",
    name: "MT. TABOR",
    centroid: [-122.5940, 45.5090],
    vibeEmoji: "\uD83C\uDF0B",
  },
  {
    id: "brooklyn",
    name: "BROOKLYN",
    centroid: [-122.6520, 45.4960],
    vibeEmoji: "\uD83D\uDE82",
  },
  {
    id: "cathedral-park",
    name: "CATHEDRAL PARK",
    centroid: [-122.7640, 45.5840],
    vibeEmoji: "\u26EA",
  },
  {
    id: "laurelhurst",
    name: "LAURELHURST",
    centroid: [-122.6270, 45.5240],
    vibeEmoji: "\uD83E\uDDA2",
  },
  {
    id: "eliot",
    name: "ELIOT",
    centroid: [-122.6630, 45.5430],
    vibeEmoji: "\uD83C\uDFAA",
  },
] as const

export const NEIGHBORHOOD_BY_ID = new Map(
  NEIGHBORHOODS.map((n) => [n.id, n])
)

export const NEIGHBORHOOD_BY_NAME = new Map(
  NEIGHBORHOODS.map((n) => [n.name, n])
)
