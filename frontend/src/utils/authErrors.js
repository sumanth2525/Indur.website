const AUTH_MESSAGES = {
  'auth/invalid-verification-code': 'Invalid or expired OTP.',
  'auth/code-expired': 'OTP expired. Request a new one.',
  'auth/invalid-phone-number': 'Enter a valid phone number.',
  'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
  'auth/quota-exceeded': 'SMS limit reached. Try again later or use Google sign-in.',
  'auth/captcha-check-failed': 'Security check failed. Refresh and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Pop-up blocked. Allow pop-ups for this site.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/internal-error': 'Sign-in is temporarily unavailable. Try again shortly.',
  'auth/unauthorized-domain': 'This site is not authorized for sign-in yet.',
  'auth/operation-not-allowed': 'Phone sign-in is not enabled for this project yet.',
  'auth/billing-not-enabled': 'Phone OTP needs Firebase Blaze billing for real numbers. Use Google sign-in, or add a test number in Firebase Console.',
  'auth/missing-app-credential': 'Phone verification failed. Refresh the page and try again.',
  'auth/invalid-app-credential': 'Phone verification failed. Refresh the page and try again.',
}

export function getAuthErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const code = err?.code
  if (code && AUTH_MESSAGES[code]) return AUTH_MESSAGES[code]
  if (typeof err?.message === 'string' && err.message.startsWith('Firebase:')) {
    return fallback
  }
  return fallback
}
