import { describe, it, expect } from 'vitest'
import { sanitizeGuestPath, sanitizeInternalPath } from '../safeRedirect'
import { getAuthErrorMessage } from '../authErrors'

describe('sanitizeInternalPath', () => {
  it('allows safe internal paths', () => {
    expect(sanitizeInternalPath('/browse')).toBe('/browse')
    expect(sanitizeInternalPath('/property/abc123')).toBe('/property/abc123')
    expect(sanitizeInternalPath('/browse?q=test')).toBe('/browse?q=test')
  })

  it('blocks open redirects', () => {
    expect(sanitizeInternalPath('https://evil.com')).toBe('/browse')
    expect(sanitizeInternalPath('//evil.com')).toBe('/browse')
    expect(sanitizeInternalPath('/\\evil.com')).toBe('/browse')
    expect(sanitizeInternalPath('javascript:alert(1)')).toBe('/browse')
  })
})

describe('sanitizeGuestPath', () => {
  it('allows browse, property detail, and services paths', () => {
    expect(sanitizeGuestPath('/browse')).toBe('/browse')
    expect(sanitizeGuestPath('/property/abc123')).toBe('/property/abc123')
    expect(sanitizeGuestPath('/services')).toBe('/services')
    expect(sanitizeGuestPath('/services/packers-movers')).toBe('/services/packers-movers')
    expect(sanitizeGuestPath('/browse?q=test')).toBe('/browse?q=test')
  })

  it('redirects auth-only paths to browse', () => {
    expect(sanitizeGuestPath('/post')).toBe('/browse')
    expect(sanitizeGuestPath('/profile')).toBe('/browse')
    expect(sanitizeGuestPath('/messages')).toBe('/browse')
  })
})

describe('getAuthErrorMessage', () => {
  it('maps firebase auth codes to safe messages', () => {
    expect(getAuthErrorMessage({ code: 'auth/invalid-verification-code' }, 'x')).toBe('Invalid or expired OTP.')
    expect(getAuthErrorMessage({ code: 'auth/too-many-requests' }, 'x')).toBe('Too many attempts. Please wait and try again.')
  })

  it('hides raw Firebase error strings', () => {
    expect(getAuthErrorMessage({ message: 'Firebase: Error (auth/internal-error).' }, 'Try again')).toBe('Try again')
  })
})
