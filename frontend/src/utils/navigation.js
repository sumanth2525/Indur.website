const BACK_FALLBACKS = [
  { match: /^\/profile\/edit/, fallback: '/profile' },
  { match: /^\/profile\/listings/, fallback: '/profile' },
  { match: /^\/profile\/notifications/, fallback: '/profile' },
  { match: /^\/profile$/, fallback: '/browse' },
  { match: /^\/support/, fallback: '/profile' },
  { match: /^\/post/, fallback: '/browse' },
  { match: /^\/property\//, fallback: '/browse' },
  { match: /^\/services\//, fallback: '/services' },
  { match: /^\/services$/, fallback: '/browse' },
  { match: /^\/messages\//, fallback: '/messages' },
  { match: /^\/messages$/, fallback: '/browse' },
  { match: /^\/browse/, fallback: '/' },
]

export function getBackFallback(pathname, defaultFallback = '/browse') {
  for (const { match, fallback } of BACK_FALLBACKS) {
    if (match.test(pathname)) return fallback
  }
  return defaultFallback
}

export function canNavigateBack() {
  if (typeof window === 'undefined') return false
  const idx = window.history.state?.idx
  return typeof idx === 'number' ? idx > 0 : window.history.length > 1
}
