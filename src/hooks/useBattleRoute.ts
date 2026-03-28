const routeCache = new Map<string, GeoJSON.LineString>()

function cacheKey(a: readonly [number, number], b: readonly [number, number]): string {
  return [a, b].map((c) => c.join(",")).sort().join(";")
}

function straightLine(a: readonly [number, number], b: readonly [number, number]): GeoJSON.LineString {
  return {
    type: "LineString",
    coordinates: [[...a], [...b]],
  }
}

export async function fetchBattleRoute(
  centroidA: readonly [number, number],
  centroidB: readonly [number, number]
): Promise<GeoJSON.LineString> {
  const key = cacheKey(centroidA, centroidB)
  const cached = routeCache.get(key)
  if (cached) return cached

  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) return straightLine(centroidA, centroidB)

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${centroidA[0]},${centroidA[1]};${centroidB[0]},${centroidB[1]}?geometries=geojson&overview=full&access_token=${token}`
    const res = await fetch(url)
    if (!res.ok) return straightLine(centroidA, centroidB)

    const data = await res.json()
    const geometry = data.routes?.[0]?.geometry as GeoJSON.LineString | undefined
    if (!geometry) return straightLine(centroidA, centroidB)

    routeCache.set(key, geometry)
    return geometry
  } catch {
    return straightLine(centroidA, centroidB)
  }
}
