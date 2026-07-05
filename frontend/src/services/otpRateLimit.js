export const OTP_LIMITS = {
  PER_PHONE_HOUR: 3,
  PER_PHONE_DAY: 8,
  PER_DEVICE_HOUR: 5,
  PER_DEVICE_DAY: 15,
  MIN_INTERVAL_MS: 60_000,
}

export class OtpRateLimitError extends Error {
  constructor(message, retryAfterSeconds = 0) {
    super(message)
    this.name = 'OtpRateLimitError'
    this.code = 'auth/rate-limit-exceeded'
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export function normalizePhoneKey(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  const normalized = digits.length === 10 ? digits : digits.slice(-10)
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    throw new Error('Invalid phone number')
  }
  return normalized
}

export function hourBucket(date = new Date()) {
  return Math.floor(date.getTime() / (60 * 60 * 1000))
}

export function dayBucket(date = new Date()) {
  return Math.floor(date.getTime() / (24 * 60 * 60 * 1000))
}

const DEVICE_ID_KEY = 'indur_device_id'

export function getOrCreateDeviceId() {
  if (typeof window === 'undefined') return 'server'
  let id = window.localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export function getRetryAfterSeconds(lastSentAt, minIntervalMs = OTP_LIMITS.MIN_INTERVAL_MS) {
  if (!lastSentAt) return 0
  const elapsed = Date.now() - lastSentAt
  if (elapsed >= minIntervalMs) return 0
  return Math.ceil((minIntervalMs - elapsed) / 1000)
}

export function nextAttemptCounts(existing, limits, now = Date.now()) {
  const currentHour = hourBucket(new Date(now))
  const currentDay = dayBucket(new Date(now))

  const countHour = existing?.hourBucket === currentHour ? (existing.countHour || 0) + 1 : 1
  const countDay = existing?.dayBucket === currentDay ? (existing.countDay || 0) + 1 : 1

  if (existing?.lastSentAt && now - existing.lastSentAt < limits.MIN_INTERVAL_MS) {
    const retryAfterSeconds = getRetryAfterSeconds(existing.lastSentAt, limits.MIN_INTERVAL_MS)
    throw new OtpRateLimitError(
      `Please wait ${retryAfterSeconds} seconds before requesting another OTP.`,
      retryAfterSeconds,
    )
  }

  if (countHour > limits.PER_HOUR) {
    throw new OtpRateLimitError('Too many OTP requests for this number. Try again in about an hour.', 3600)
  }

  if (countDay > limits.PER_DAY) {
    throw new OtpRateLimitError('Daily OTP limit reached for this number. Try again tomorrow or use Google sign-in.', 86400)
  }

  return {
    countHour,
    hourBucket: currentHour,
    countDay,
    dayBucket: currentDay,
    lastSentAt: now,
  }
}
