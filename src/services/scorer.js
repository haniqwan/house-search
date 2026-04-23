// Area scoring engine
// Each dimension produces a 0-100 score.
// Priority weight: 0=Off (skip), 1=Low (×0.5), 2=Medium (×1), 3=High (×1.5), 4=Must (×2.5)
// Final score = weighted average across active dimensions

import LONDON_AREAS from '../data/londonAreas';
import { getCrimeCount, normaliseCrimeScores } from '../api/crime';
import { getNearbyStops, getJourneyTime, transportScore } from '../api/transport';
import { getAmenityCounts, amenityScore } from '../api/amenities';
import { lookupPostcode, haversineKm } from '../api/postcodes';

const WEIGHT = [0, 0.5, 1, 1.5, 2.5]; // indexed by priority 0-4

// Score house prices for an area
// "Rising prices" = user wants growth potential → high score = high price rise
function priceScore(area) {
  // Normalise priceChange across all areas
  const all = LONDON_AREAS.map(a => a.priceChange);
  const min = Math.min(...all);
  const max = Math.max(...all);
  return Math.round(((area.priceChange - min) / (max - min)) * 100);
}

// Score school quality from seeded data
function schoolScore(area) {
  return area.schoolScore; // already 0-100
}

// Score how close an area is to user's spots
// spots: [{ postcode, maxMinutes }] — use straight-line distance as proxy
async function distanceScore(area, spots, spotCoords) {
  if (!spots.length) return 75;
  const scores = spotCoords.map(({ lat, lng, maxMinutes }) => {
    const km = haversineKm(area.lat, area.lng, lat, lng);
    // Rough conversion: 30km/h average door-to-door in London
    const estimatedMins = (km / 30) * 60;
    if (estimatedMins <= maxMinutes * 0.6) return 100;
    if (estimatedMins <= maxMinutes) return 70;
    if (estimatedMins <= maxMinutes * 1.4) return 35;
    return 0;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Parse a rough time from spot label like "22 min" → 22
function parseMaxMinutes(timeStr) {
  const m = String(timeStr).match(/(\d+)/);
  return m ? parseInt(m[1]) : 30;
}

// Effective price for an area given property type preference
function effectivePrice(area, propertyType) {
  if (propertyType === 'flat') return Math.round(area.avgPrice * 0.75);
  if (propertyType === 'house') return Math.round(area.avgPrice * 1.1);
  return area.avgPrice;
}

// Affordability score: 100 if well within budget, 0 if over
function affordabilityScore(area, budget, propertyType) {
  if (!budget) return 75;
  const price = effectivePrice(area, propertyType);
  if (price <= budget * 0.8) return 100;
  if (price <= budget) return 80;
  if (price <= budget * 1.1) return 40;
  return 0;
}

export async function scoreAreas({
  priorities,        // { crime, schools, transport, amenities, prices, distance }
  selectedAmenities, // { supermarket, gym, cafes, restaurants }
  selectedTransport, // { tube, thameslink }
  spots,             // [{ label, time }]
  budget,            // number | null — max price £
  propertyType,      // 'flat' | 'house' | 'any'
  onProgress,        // (pct: number, message: string) => void
}) {
  const areas = LONDON_AREAS;
  const total = areas.length;

  onProgress?.(2, 'Resolving spot locations…');

  // Resolve spot postcodes to coordinates
  const spotCoords = [];
  for (const spot of spots) {
    // Try to extract a postcode from the label
    const postcodeMatch = spot.label.match(/[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i);
    if (postcodeMatch) {
      const coords = await lookupPostcode(postcodeMatch[0]);
      if (coords) spotCoords.push({ ...coords, maxMinutes: parseMaxMinutes(spot.time) });
    }
  }

  onProgress?.(8, 'Fetching crime data for all areas…');

  // Fetch crime counts in parallel (batched 5 at a time to avoid rate limiting)
  const crimeCountMap = {};
  for (let i = 0; i < areas.length; i += 5) {
    const batch = areas.slice(i, i + 5);
    const results = await Promise.all(batch.map(a => getCrimeCount(a.lat, a.lng)));
    batch.forEach((a, j) => { crimeCountMap[a.id] = results[j]; });
    onProgress?.(8 + Math.round((i / areas.length) * 25), `Fetching crime data (${i + batch.length}/${total})…`);
  }
  const crimeScores = normaliseCrimeScores(crimeCountMap);

  onProgress?.(35, 'Checking transport connections…');

  // Fetch transport stops in parallel
  const transportStops = {};
  for (let i = 0; i < areas.length; i += 5) {
    const batch = areas.slice(i, i + 5);
    const results = await Promise.all(batch.map(a => getNearbyStops(a.lat, a.lng)));
    batch.forEach((a, j) => { transportStops[a.id] = results[j]; });
    onProgress?.(35 + Math.round((i / areas.length) * 20), `Checking transport (${i + batch.length}/${total})…`);
  }

  onProgress?.(57, 'Counting local amenities…');

  // Fetch amenity counts in parallel
  const amenityCounts = {};
  for (let i = 0; i < areas.length; i += 5) {
    const batch = areas.slice(i, i + 5);
    const results = await Promise.all(batch.map(a => getAmenityCounts(a.lat, a.lng)));
    batch.forEach((a, j) => { amenityCounts[a.id] = results[j]; });
    onProgress?.(57 + Math.round((i / areas.length) * 25), `Counting amenities (${i + batch.length}/${total})…`);
  }

  onProgress?.(84, 'Computing match scores…');

  // For each area, compute weighted score
  const results = await Promise.all(areas.map(async (area) => {
    const dimensions = [];

    const add = (priorityKey, score) => {
      const p = priorities[priorityKey];
      if (p === 0) return;
      dimensions.push({ weight: WEIGHT[p], score });
    };

    add('crime',      crimeScores[area.id] ?? 50);
    add('schools',    schoolScore(area));
    add('transport',  transportScore(transportStops[area.id], area.transportLines));
    add('amenities',  amenityScore(amenityCounts[area.id], selectedAmenities));
    add('prices',     priceScore(area));
    add('distance',   await distanceScore(area, spots, spotCoords));

    // Budget affordability — always factor in if budget is set
    if (budget) {
      const aff = affordabilityScore(area, budget, propertyType ?? 'any');
      dimensions.push({ weight: 1.5, score: aff });
    }

    if (!dimensions.length) return { ...area, matchScore: 50 };

    const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
    const weightedSum  = dimensions.reduce((s, d) => s + d.weight * d.score, 0);
    const matchScore   = Math.round(weightedSum / totalWeight);

    // Transport filter: if user requires tube/thameslink, penalise areas without
    let penalty = 0;
    if (selectedTransport.tube && !transportStops[area.id]?.hasUnderground && !area.transportLines.some(l => l.toLowerCase().includes('underground'))) penalty += 20;
    if (selectedTransport.thameslink && !transportStops[area.id]?.hasNationalRail && !area.transportLines.some(l => l.toLowerCase().includes('thameslink'))) penalty += 15;

    const effectivePriceForArea = effectivePrice(area, propertyType ?? 'any');
    const overBudget = budget ? effectivePriceForArea > budget * 1.1 : false;

    return {
      ...area,
      matchScore: Math.max(0, matchScore - penalty),
      crimeScore: crimeScores[area.id] ?? null,
      crimeCount: crimeCountMap[area.id] ?? null,
      transportData: transportStops[area.id],
      amenityData: amenityCounts[area.id],
      effectivePrice: effectivePriceForArea,
      overBudget,
    };
  }));

  onProgress?.(100, 'Done');

  return results
    .filter(a => a.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
