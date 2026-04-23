// postcodes.io — free, no key, CORS enabled

const BASE = 'https://api.postcodes.io';

export async function lookupPostcode(postcode) {
  const res = await fetch(`${BASE}/postcodes/${encodeURIComponent(postcode)}`);
  if (!res.ok) return null;
  const { result } = await res.json();
  return result ? { lat: result.latitude, lng: result.longitude, district: result.admin_district } : null;
}

export async function reverseGeocode(lat, lng) {
  const res = await fetch(`${BASE}/postcodes?lon=${lng}&lat=${lat}&limit=1`);
  if (!res.ok) return null;
  const { result } = await res.json();
  return result?.[0] ? {
    postcode: result[0].postcode,
    district: result[0].admin_district,
    lat: result[0].latitude,
    lng: result[0].longitude,
  } : null;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
