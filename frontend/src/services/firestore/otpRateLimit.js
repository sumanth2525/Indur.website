import {
  doc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseEnabled } from '../../lib/firebase'
import { COLLECTIONS } from './schema'
import {
  OTP_LIMITS,
  OtpRateLimitError,
  getOrCreateDeviceId,
  nextAttemptCounts,
  normalizePhoneKey,
} from '../otpRateLimit'

const PHONE_LIMITS = {
  PER_HOUR: OTP_LIMITS.PER_PHONE_HOUR,
  PER_DAY: OTP_LIMITS.PER_PHONE_DAY,
  MIN_INTERVAL_MS: OTP_LIMITS.MIN_INTERVAL_MS,
}

const DEVICE_LIMITS = {
  PER_HOUR: OTP_LIMITS.PER_DEVICE_HOUR,
  PER_DAY: OTP_LIMITS.PER_DEVICE_DAY,
  MIN_INTERVAL_MS: OTP_LIMITS.MIN_INTERVAL_MS,
}

async function recordLimitAttempt(collection, docId, limits) {
  const ref = doc(db, collection, docId)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    const existing = snap.exists() ? snap.data() : null
    const next = nextAttemptCounts(existing, limits)

    const payload = {
      ...next,
      updatedAt: serverTimestamp(),
    }

    if (!snap.exists()) {
      tx.set(ref, payload)
    } else {
      tx.update(ref, payload)
    }
  })
}

export async function assertOtpSendAllowed(phone) {
  if (!firebaseEnabled || !db) return

  const phoneKey = normalizePhoneKey(phone)
  const deviceId = getOrCreateDeviceId()

  await recordLimitAttempt(COLLECTIONS.otpRateLimits, phoneKey, PHONE_LIMITS)
  await recordLimitAttempt(COLLECTIONS.otpDeviceLimits, deviceId, DEVICE_LIMITS)
}

export { OtpRateLimitError, OTP_LIMITS }
