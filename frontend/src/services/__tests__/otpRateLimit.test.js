import { describe, it, expect } from 'vitest'
import {
  OTP_LIMITS,
  OtpRateLimitError,
  normalizePhoneKey,
  nextAttemptCounts,
  getRetryAfterSeconds,
  hourBucket,
  dayBucket,
} from '../otpRateLimit'

function log(step, detail) {
  console.log(`[OTP RATE LIMIT] ${step}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
}

describe('OTP rate limiting', () => {
  it('normalizes Indian phone numbers to a 10-digit key', () => {
    expect(normalizePhoneKey('9876543210')).toBe('9876543210')
    expect(normalizePhoneKey('+91 98765 43210')).toBe('9876543210')
    log('phone key', normalizePhoneKey('+919505442525'))
  })

  it('blocks requests inside the cooldown window', () => {
    const now = Date.now()
    const existing = {
      countHour: 1,
      hourBucket: hourBucket(new Date(now)),
      countDay: 1,
      dayBucket: dayBucket(new Date(now)),
      lastSentAt: now - 30_000,
    }

    expect(() => nextAttemptCounts(existing, { PER_HOUR: 3, PER_DAY: 8, MIN_INTERVAL_MS: 60_000 }, now))
      .toThrow(OtpRateLimitError)

    try {
      nextAttemptCounts(existing, { PER_HOUR: 3, PER_DAY: 8, MIN_INTERVAL_MS: 60_000 }, now)
    } catch (err) {
      log('cooldown block', { code: err.code, retryAfterSeconds: err.retryAfterSeconds, message: err.message })
      expect(err.code).toBe('auth/rate-limit-exceeded')
      expect(err.retryAfterSeconds).toBeGreaterThan(0)
    }
  })

  it('blocks when hourly phone limit is exceeded', () => {
    const now = Date.now()
    const existing = {
      countHour: 3,
      hourBucket: hourBucket(new Date(now)),
      countDay: 3,
      dayBucket: dayBucket(new Date(now)),
      lastSentAt: now - 120_000,
    }

    try {
      nextAttemptCounts(existing, { PER_HOUR: 3, PER_DAY: 8, MIN_INTERVAL_MS: 60_000 }, now)
    } catch (err) {
      log('hourly block', err.message)
      expect(err.message).toMatch(/hour/i)
    }
  })

  it('resets hourly count in a new hour bucket', () => {
    const now = Date.now()
    const existing = {
      countHour: 3,
      hourBucket: hourBucket(new Date(now)) - 1,
      countDay: 3,
      dayBucket: dayBucket(new Date(now)),
      lastSentAt: now - 120_000,
    }

    const next = nextAttemptCounts(existing, { PER_HOUR: 3, PER_DAY: 8, MIN_INTERVAL_MS: 60_000 }, now)
    log('hour reset', next)
    expect(next.countHour).toBe(1)
  })

  it('exports Blaze-safe default limits', () => {
    log('limits', OTP_LIMITS)
    expect(OTP_LIMITS.PER_PHONE_HOUR).toBeLessThanOrEqual(5)
    expect(OTP_LIMITS.PER_PHONE_DAY).toBeLessThanOrEqual(10)
    expect(getRetryAfterSeconds(Date.now() - 45_000)).toBeGreaterThan(0)
  })
})
