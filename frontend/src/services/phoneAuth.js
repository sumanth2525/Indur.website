import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../lib/firebase'

let recaptchaVerifier = null
let confirmationResult = null

function formatIndianPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.length === 10 ? digits : digits.slice(-10)
  return `+91${normalized}`
}

function getRecaptcha() {
  if (!auth) throw new Error('Firebase Auth is not configured')
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })
  }
  return recaptchaVerifier
}

export async function sendPhoneOtp(phone) {
  if (!auth) throw new Error('Firebase Auth is not configured')
  confirmationResult = await signInWithPhoneNumber(auth, formatIndianPhone(phone), getRecaptcha())
  return confirmationResult
}

export async function verifyPhoneOtp(code) {
  if (!confirmationResult) {
    throw new Error('Request OTP first')
  }
  const result = await confirmationResult.confirm(code.trim())
  confirmationResult = null
  return result.user
}

export function resetPhoneAuth() {
  confirmationResult = null
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
  }
}
