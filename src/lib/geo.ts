// Great-circle distance in km between two lat/lon points (haversine).
export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Rough road-distance estimate from straight-line distance.
export function estimateRoadKm(straightKm: number): number {
  return Math.round(straightKm * 1.3);
}

// Fetch accurate driving distance in km from the public OSRM demo server.
// Falls back to haversine × 1.3 on any failure.
export async function fetchRoadDistanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
  signal?: AbortSignal,
): Promise<number> {
  const fallback = estimateRoadKm(haversineKm(a, b));
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${a.lon},${a.lat};${b.lon},${b.lat}?overview=false&alternatives=false&steps=false`;
    const res = await fetch(url, { signal });
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      code?: string;
      routes?: { distance: number }[];
    };
    if (data.code !== "Ok" || !data.routes?.length) return fallback;
    const meters = data.routes[0].distance;
    if (!Number.isFinite(meters) || meters <= 0) return fallback;
    return Math.max(1, Math.round(meters / 1000));
  } catch {
    return fallback;
  }
}