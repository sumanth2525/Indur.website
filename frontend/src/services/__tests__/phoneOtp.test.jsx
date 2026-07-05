import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../../pages/Login'
import { renderWithProviders } from '../../test/renderWithProviders'
import { getAuthErrorMessage } from '../../utils/authErrors'
import { isValidPhone } from '../../utils/validation'
import { sendPhoneOtp, verifyPhoneOtp, resetPhoneAuth } from '../phoneAuth'
import { assertOtpSendAllowed } from '../firestore/otpRateLimit'

const mockRender = vi.hoisted(() => vi.fn())
const mockClear = vi.hoisted(() => vi.fn())
const mockSignInWithPhoneNumber = vi.hoisted(() => vi.fn())

vi.mock('../../lib/firebase', () => ({
  auth: { _mock: true },
}))

vi.mock('../../services/dataApi', () => ({
  loadProfile: vi.fn(),
  fetchProfileById: vi.fn(),
}))

vi.mock('../firestore/otpRateLimit', () => ({
  assertOtpSendAllowed: vi.fn().mockResolvedValue(undefined),
  OtpRateLimitError: class OtpRateLimitError extends Error {
    constructor(message, retryAfterSeconds = 0) {
      super(message)
      this.code = 'auth/rate-limit-exceeded'
      this.retryAfterSeconds = retryAfterSeconds
    }
  },
  OTP_LIMITS: {
    PER_PHONE_HOUR: 3,
    PER_PHONE_DAY: 8,
    PER_DEVICE_HOUR: 5,
    PER_DEVICE_DAY: 15,
    MIN_INTERVAL_MS: 60000,
  },
}))

vi.mock('firebase/auth', () => ({
  RecaptchaVerifier: class RecaptchaVerifier {
    constructor() {
      this.render = mockRender
      this.clear = mockClear
    }
  },
  signInWithPhoneNumber: (...args) => mockSignInWithPhoneNumber(...args),
  GoogleAuthProvider: class GoogleAuthProvider {},
  onAuthStateChanged: vi.fn(() => () => {}),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))

function log(step, detail) {
  const payload = typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2)
  console.log(`[OTP TEST] ${step}: ${payload}`)
}

describe('Phone OTP flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetPhoneAuth()
    mockRender.mockResolvedValue(undefined)
    document.body.innerHTML = '<div id="recaptcha-container"></div>'
  })

  describe('phone number validation', () => {
    it('accepts valid 10-digit Indian numbers', () => {
      const samples = ['9876543210', '9505442525', '+919876543210']
      for (const phone of samples) {
        const valid = isValidPhone(phone)
        log('validate phone', { phone, valid })
        expect(valid).toBe(true)
      }
    })

    it('rejects invalid numbers before OTP is sent', () => {
      const samples = ['12345', '5123456789', '']
      for (const phone of samples) {
        const valid = isValidPhone(phone)
        log('reject invalid phone', { phone, valid })
        expect(valid).toBe(false)
      }
    })
  })

  describe('auth error messages', () => {
    const cases = [
      ['auth/operation-not-allowed', 'Phone sign-in is not enabled for this project yet.'],
      ['auth/billing-not-enabled', 'Phone OTP needs Firebase Blaze billing for real numbers. Use Google sign-in, or add a test number in Firebase Console.'],
      ['auth/invalid-verification-code', 'Invalid or expired OTP.'],
      ['auth/captcha-check-failed', 'Security check failed. Refresh and try again.'],
      ['auth/quota-exceeded', 'SMS limit reached. Try again later or use Google sign-in.'],
    ]

    it.each(cases)('maps %s to user-facing message', (code, expected) => {
      const err = { code, message: `Firebase: Error (${code}).` }
      const message = getAuthErrorMessage(err, 'fallback')
      log('auth error mapping', { code, message, expected })
      expect(message).toBe(expected)
    })
  })

  describe('phoneAuth service', () => {
    it('checks rate limits before calling Firebase', async () => {
      mockSignInWithPhoneNumber.mockResolvedValue({ verificationId: 'vid-123' })

      await sendPhoneOtp('9876543210')

      expect(assertOtpSendAllowed).toHaveBeenCalledWith('9876543210')
      log('rate limit gate', 'assertOtpSendAllowed ran before Firebase send')
    })

    it('blocks Firebase when rate limit rejects the request', async () => {
      const { OtpRateLimitError } = await import('../firestore/otpRateLimit')
      assertOtpSendAllowed.mockRejectedValueOnce(
        new OtpRateLimitError('Please wait 45 seconds before requesting another OTP.', 45),
      )

      await expect(sendPhoneOtp('9876543210')).rejects.toMatchObject({
        code: 'auth/rate-limit-exceeded',
      })
      expect(mockSignInWithPhoneNumber).not.toHaveBeenCalled()
      log('rate limit block', 'Firebase send skipped when limit exceeded')
    })

    it('formats phone to +91 E.164 and sends OTP via Firebase', async () => {
      mockSignInWithPhoneNumber.mockResolvedValue({ verificationId: 'vid-123' })

      log('send OTP start', { input: '9876543210' })
      const result = await sendPhoneOtp('9876543210')

      log('send OTP result', { verificationId: result.verificationId })
      log('Firebase calls', {
        renderCalled: mockRender.mock.calls.length,
        signInArgs: mockSignInWithPhoneNumber.mock.calls[0],
      })

      expect(mockRender).toHaveBeenCalledTimes(1)
      expect(mockSignInWithPhoneNumber).toHaveBeenCalledWith(
        { _mock: true },
        '+919876543210',
        expect.objectContaining({ render: mockRender, clear: mockClear }),
      )
      expect(result.verificationId).toBe('vid-123')
    })

    it('logs and rethrows when Firebase returns operation-not-allowed', async () => {
      const firebaseError = {
        code: 'auth/operation-not-allowed',
        message: 'Firebase: Error (auth/operation-not-allowed).',
      }
      mockSignInWithPhoneNumber.mockRejectedValue(firebaseError)

      log('send OTP expecting failure', { code: firebaseError.code })

      await expect(sendPhoneOtp('9876543210')).rejects.toMatchObject({
        code: 'auth/operation-not-allowed',
      })

      const uiMessage = getAuthErrorMessage(firebaseError, 'Could not send OTP')
      log('UI would show', uiMessage)
      expect(uiMessage).toBe('Phone sign-in is not enabled for this project yet.')
      expect(mockClear).toHaveBeenCalled()
    })

    it('logs and rethrows when Firebase returns billing-not-enabled', async () => {
      const firebaseError = {
        code: 'auth/billing-not-enabled',
        message: 'Firebase: Error (auth/billing-not-enabled).',
      }
      mockSignInWithPhoneNumber.mockRejectedValue(firebaseError)

      log('send OTP billing check', { code: firebaseError.code })

      await expect(sendPhoneOtp('9505442525')).rejects.toMatchObject({
        code: 'auth/billing-not-enabled',
      })

      const uiMessage = getAuthErrorMessage(firebaseError, 'Could not send OTP')
      log('UI would show', uiMessage)
      expect(uiMessage).toContain('Blaze billing')
    })

    it('verifies OTP after sendPhoneOtp succeeds', async () => {
      const mockConfirm = vi.fn().mockResolvedValue({ user: { uid: 'uid-test', phoneNumber: '+919505442525' } })
      mockSignInWithPhoneNumber.mockResolvedValue({ confirm: mockConfirm })

      log('verify flow', 'sending OTP first')
      await sendPhoneOtp('9505442525')

      log('verify flow', 'confirming OTP 123456')
      const user = await verifyPhoneOtp('123456')

      log('verify result', { uid: user.uid, phoneNumber: user.phoneNumber })
      expect(mockConfirm).toHaveBeenCalledWith('123456')
      expect(user.uid).toBe('uid-test')
    })
  })

  describe('Login page OTP UI', () => {
    it('shows validation error for invalid phone without calling Firebase', async () => {
      const user = userEvent.setup()
      const requestPhoneOtp = vi.fn()

      renderWithProviders(<Login />, { auth: { user: null, requestPhoneOtp } })

      await user.click(screen.getByRole('button', { name: /continue with phone number/i }))
      await user.type(screen.getByPlaceholderText(/phone/i), '12345')
      await user.click(screen.getByRole('button', { name: /send otp/i }))

      const errorText = await screen.findByText(/valid 10-digit/i)
      log('Login UI validation error', errorText.textContent)
      expect(requestPhoneOtp).not.toHaveBeenCalled()
    })

    it('shows Firebase error message when OTP send fails', async () => {
      const user = userEvent.setup()
      const requestPhoneOtp = vi.fn().mockRejectedValue({
        code: 'auth/billing-not-enabled',
        message: 'Firebase: Error (auth/billing-not-enabled).',
      })

      renderWithProviders(<Login />, { auth: { user: null, requestPhoneOtp } })

      await user.click(screen.getByRole('button', { name: /continue with phone number/i }))
      await user.type(screen.getByPlaceholderText(/phone/i), '9876543210')
      await user.click(screen.getByRole('button', { name: /send otp/i }))

      await waitFor(() => {
        expect(requestPhoneOtp).toHaveBeenCalledWith('9876543210')
      })

      const errorEl = await screen.findByText(/Blaze billing/i)
      log('Login UI Firebase error', errorEl.textContent)
      expect(errorEl).toBeInTheDocument()
    })

    it('advances to OTP entry after successful send', async () => {
      const user = userEvent.setup()
      const requestPhoneOtp = vi.fn().mockResolvedValue(undefined)

      renderWithProviders(<Login />, { auth: { user: null, requestPhoneOtp } })

      await user.click(screen.getByRole('button', { name: /continue with phone number/i }))
      await user.type(screen.getByPlaceholderText(/phone/i), '9505442525')
      await user.click(screen.getByRole('button', { name: /send otp/i }))

      await waitFor(() => {
        expect(requestPhoneOtp).toHaveBeenCalledWith('9505442525')
      })

      log('Login UI', 'OTP sent — showing verify step')
      expect(await screen.findByPlaceholderText(/otp/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /verify & login/i })).toBeInTheDocument()
    })
  })
})
