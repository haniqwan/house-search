// TfL Unified API — free, no key needed for basic usage
// Counts tube/rail/overground stops within 650m of a point
// Optionally calculates journey time from area to user's saved spots

const TFL = 'https://api.tfl.gov.uk';
const CACHE = new Map();

// stopTypes that count as "good" transport
const QUALITY_MODES = [
  'NaptanMetroStation',   // Underground
  'NaptanRailStation',    // National Rail / Elizabeth line / Thameslink
  'NaptanSurface',        // Overground
];

export async function getNearbyStops(lat, lng, radiusM = 650) {
  const key = `stops:${lat.toFixed(3)}:${lng.toFixed(3)}`;
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const url = `${TFL}/StopPoint?lat=${lat}&lon=${lng}&stopTypes=${QUALITY_MODES.join(',')}&radius=${radiusM}&useStopPointHierarchy=false&modes=tube,dlr,elizabeth-line,overground,national-rail,tram&returnLines=true&app_key=${import.meta.env.VITE_TFL_KEY || ''}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const stops = data.stopPoints || [];
    const result = {
      count: stops.length,
      lines: [...new Set(stops.flatMap(s => (s.lines || []).map(l => l.name)))],
      hasUnderground: stops.some(s => s.modes?.includes('tube')),
      hasDLR: stops.some(s => s.modes?.includes('dlr')),
      hasElizabeth: stops.some(s => s.modes?.includes('elizabeth-line')),
      hasOverground: stops.some(s => s.modes?.includes('overground')),
      hasNationalRail: stops.some(s => s.modes?.includes('national-rail')),
    };
    CACHE.set(key, result);
    return result;
  } catch {
    return null;
  }
}

// Journey time from area centroid to a destination postcode (in minutes)
export async function getJourneyTime(fromLat, fromLng, toPostcode) {
  const key = `journey:${fromLat.toFixed(3)}:${fromLng.toFixed(3)}:${toPostcode}`;
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const url = `${TFL}/Journey/JourneyResults/${fromLat},${fromLng}/to/${encodeURIComponent(toPostcode)}?mode=tube,dlr,overground,elizabeth-line,national-rail&app_key=${import.meta.env.VITE_TFL_KEY || ''}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const journeys = data.journeys || [];
    if (!journeys.length) return null;
    const mins = journeys[0].duration;
    CACHE.set(key, mins);
    return mins;
  } catch {
    return null;
  }
}

// Compute transport score 0-100 from stop data + seeded transport lines
export function transportScore(stops, seededLines) {
  if (!stops) {
    // Fall back to seeded line count
    const lineCount = seededLines?.length || 0;
    return Math.min(100, lineCount * 22);
  }

  let score = 0;
  if (stops.hasUnderground)   score += 35;
  if (stops.hasElizabeth)     score += 30;
  if (stops.hasOverground)    score += 20;
  if (stops.hasDLR)           score += 20;
  if (stops.hasNationalRail)  score += 15;
  score += Math.min(stops.count * 5, 20); // bonus for density
  return Math.min(score, 100);
}
