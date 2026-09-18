import { BASE } from '../data/geo'

const R = 6371 // km

// Straight-line distance. Honest about what it is: the drive is always longer.
export function distanceKm(from, to = BASE) {
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(to.lat - from.lat)
  const dLng = rad(to.lng - from.lng)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Corridor roads wander about 1.25× the straight line and average ~45 km/h.
// Checked against real drives: Leppington ~9 min, Liverpool ~14 min.
export function driveMinutes(km) {
  return Math.max(2, Math.round((km * 1.25) / 45 * 60))
}

export function describeDistance(km) {
  if (km < 1) return { km, minutes: 2, line: "You're practically next door — under a kilometre away." }
  const minutes = driveMinutes(km)
  const rounded = km < 10 ? km.toFixed(1) : Math.round(km)
  if (km <= 12) return { km, minutes, line: `About ${rounded} km away — roughly ${minutes} minutes by car.` }
  if (km <= 25) return { km, minutes, line: `About ${rounded} km away — roughly ${minutes} minutes by car. Still fine for lessons at our space; ask us about coming to you.` }
  return { km, minutes, line: `About ${rounded} km away. That's outside our usual patch, so give us a call before you count on it.` }
}
