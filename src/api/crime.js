// data.police.uk — no API key required, CORS enabled
// Returns crimes within 1 mile of lat/lng for the last 3 months

const BASE = 'https://data.police.uk/api';
const CACHE = new Map();

function cacheKey(lat, lng) {
  return `crime:${lat.toFixed(3)}:${lng.toFixed(3)}`;
}

let _latestCrimeDate = null;
async function getLatestDate() {
  if (_latestCrimeDate) return _latestCrimeDate;
  try {
    const res = await fetch(`${BASE}/crimes-street-dates`);
    if (!res.ok) return null;
    const dates = await res.json();
    _latestCrimeDate = dates[0]?.date ?? null;
    return _latestCrimeDate;
  } catch {
    return null;
  }
}

export async function getCrimeCount(lat, lng) {
  const key = cacheKey(lat, lng);
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const latestDate = await getLatestDate();
    if (!latestDate) return null;

    // Use lat/lng point — API returns crimes within ~1 mile radius
    const url = `${BASE}/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${latestDate}`;
    const res = await fetch(url);
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
