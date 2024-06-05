export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
// functions to get distance between 2 locations based on latitude and longitude
export function calculateDistance(loc_1, loc_2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRadians(loc_1.latitude);
  const φ2 = toRadians(loc_2.latitude);
  const Δφ = toRadians(loc_2.latitude - loc_1.latitude);
  const Δλ = toRadians(loc_2.longitude - loc_1.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
}
