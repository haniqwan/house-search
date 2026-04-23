// data.police.uk — no API key required, CORS enabled
// Returns crimes within 1 mile of lat/lng for the last 3 months

const BASE = 'https://data.police.uk/api';
const CACHE = new Map();

function cacheKey(lat, lng) {
  return `crime:${lat.toFixed(3)}:${lng.toFixed(3)}`;
}

export async function getCrimeCount(lat, lng) {
  const key = cacheKey(lat, lng);
  if (CACHE.has(key)) return CACHE.get(key);

  // Use a poly that approximates a ~1km radius square around the point
  const d = 0.009; // ~1km in degrees
  const poly = [
    `${lat - d},${lng - d}`,
    `${lat - d},${lng + d}`,
    `${lat + d},${lng + d}`,
    `${lat + d},${lng - d}`,
  ].join(':');

  try {
    // Get latest available date first
    const dateRes = await fetch(`${BASE}/crimes-street-dates`);
    const dates = await dateRes.json();
    const latestDate = dates[0]?.date;

    if (!latestDate) return null;

    const res = await fetch(
      `${BASE}/crimes-street?poly=${poly}&date=${latestDate}`
    );

    if (!res.ok) return null;
    const crimes = await res.json();
    const count = Array.isArray(crimes) ? crimes.length : 0;
    CACHE.set(key, count);
    return count;
  } catch {
    return null;
  }
}

// Normalize crime counts for a set of areas into 0-100 scores
// Higher score = lower crime (safer)
export function normaliseCrimeScores(countMap) {
  const values = Object.values(countMap).filter(v => v !== null);
  if (values.length === 0) return {};
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const scores = {};
  for (const [id, count] of Object.entries(countMap)) {
    if (count === null) {
      scores[id] = 50; // fallback middle score
    } else {
      // Invert: fewer crimes = higher score
      scores[id] = Math.round(100 - ((count - min) / range) * 100);
    }
  }
  return scores;
}
