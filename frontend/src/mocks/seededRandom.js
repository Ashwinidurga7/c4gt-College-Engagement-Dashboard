/** Deterministic PRNG (mulberry32) so mock data is identical on every load. */
export function seededRandom(seed) {
  let state = seed >>> 0
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomInt(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min
}

/** ISO date (YYYY-MM-DD) for a UTC date, avoiding timezone drift. */
export function isoDate(date) {
  return date.toISOString().slice(0, 10)
}
