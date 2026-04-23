// Overpass API (OpenStreetMap) — free, no key, CORS enabled
// Counts amenity types within 800m of a lat/lng

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const CACHE = new Map();

const QUERIES = {
  supermarket: `node["shop"~"supermarket|convenience"](around:800,LAT,LNG);`,
  gym:         `node["leisure"~"fitness_centre|sports_centre"](around:800,LAT,LNG);way["leisure"~"fitness_centre|sports_centre"](around:800,LAT,LNG);`,
  cafes:       `node["amenity"="cafe"](around:800,LAT,LNG);`,
  restaurants: `node["amenity"~"restaurant|fast_food"](around:800,LAT,LNG);`,
  parks:       `way["leisure"="park"](around:800,LAT,LNG);relation["leisure"="park"](around:800,LAT,LNG);`,
};

async function countOverpass(query) {
  const body = `[out:json][timeout:10];(${query});out count;`;
  const res = await fetch(OVERPASS, {
    method: 'POST',
    body: `data=${encodeURIComponent(body)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.elements?.[0]?.tags?.total ?? null;
}

export async function getAmenityCounts(lat, lng) {
  const key = `amenity:${lat.toFixed(3)}:${lng.toFixed(3)}`;
  if (CACHE.has(key)) return CACHE.get(key);

  const filled = (q) => q.replaceAll('LAT', lat).replaceAll('LNG', lng);

  try {
    const [supermarket, gym, cafes, restaurants, parks] = await Promise.all([
      countOverpass(filled(QUERIES.supermarket)),
      countOverpass(filled(QUERIES.gym)),
      countOverpass(filled(QUERIES.cafes)),
      countOverpass(filled(QUERIES.restaurants)),
      countOverpass(filled(QUERIES.parks)),
    ]);

    const result = { supermarket, gym, cafes, restaurants, parks };
    CACHE.set(key, result);
    return result;
  } catch {
    return null;
  }
}

// Score amenities based on which types the user selected (0-100)
// selectedAmenities: { supermarket: bool, gym: bool, cafes: bool, restaurants: bool }
export function amenityScore(counts, selectedAmenities) {
  if (!counts) return 50;

  const thresholds = {
    supermarket: { low: 1, high: 3 },
    gym:         { low: 1, high: 3 },
    cafes:       { low: 3, high: 10 },
    restaurants: { low: 3, high: 12 },
  };

  const selected = Object.entries(selectedAmenities).filter(([, v]) => v).map(([k]) => k);
  if (!selected.length) return 75;

  const scores = selected.map(type => {
    const count = counts[type] ?? 0;
    const t = thresholds[type];
    if (count === 0) return 0;
    if (count >= t.high) return 100;
    return Math.round((count / t.high) * 100);
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
