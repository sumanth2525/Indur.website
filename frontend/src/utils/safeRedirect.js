const DEFAULT_FALLBACK = '/browse'

const GUEST_ALLOWED_PREFIXES = ['/browse', '/property/', '/services']

/**
 * Guests may only browse listings and view property details — not post, profile, etc.
 */
export function sanitizeGuestPath(path, fallback = DEFAULT_FALLBACK) {
  const safe = sanitizeInternalPath(path, fallback)
  const pathOnly = safe.split(/[?#]/)[0]
  const allowed = GUEST_ALLOWED_PREFIXES.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(prefix),
  )
  return allowed ? safe : fallback
}

/**
 * Allow only same-app relative paths (blocks open redirects via //evil.com or https://…).
 */
export function sanitizeInternalPath(path, fallback = DEFAULT_FALLBACK) {
  if (typeof path !== 'string') return fallback

  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return fallback

  const pathOnly = trimmed.split(/[?#]/)[0]
  if (!/^\/[\w\-./~]*$/.test(pathOnly)) return fallback

  return trimmed
}
