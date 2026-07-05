import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Icon from '../components/Icon'
import LanguageToggle from '../components/LanguageToggle'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { isValidPhone } from '../utils/validation'
import { sanitizeGuestPath, sanitizeInternalPath } from '../utils/safeRedirect'
import { getAuthErrorMessage } from '../utils/authErrors'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function BrandMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  )
}

function LoginFooter() {
  const { t } = useLanguage()

  return (
    <p className="text-center text-xs leading-relaxed text-[#707070]">
      {t('loginFooterPrefix')}{' '}
      <Link to="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {t('termsLink')}
      </Link>
      {' & '}
      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {t('privacyLink')}
      </Link>
      .
    </p>
  )
}

export default function Login() {
  const { user, loginWithGoogle, loginWithPhone, requestPhoneOtp, continueAsGuest, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const [serviceMode, setServiceMode] = useState('property')
  const afterLoginPath = sanitizeInternalPath(
    routeLocation.state?.from || (serviceMode === 'services' ? '/services' : '/browse'),
  )
  const afterLoginState = routeLocation.state?.search ? { search: routeLocation.state.search } : undefined

  const [showPhoneAuth, setShowPhoneAuth] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [error, setError] = useState('')

  if (user && !user.isGuest) {
    navigate(afterLoginPath, { replace: true, state: afterLoginState })
    return null
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
      navigate(afterLoginPath, { state: afterLoginState })
    } catch {
      setError('Login failed')
    }
  }

  const handleSendOtp = async () => {
    if (!isValidPhone(phone)) {
      setError('Enter a valid 10-digit Indian phone number')
      return
    }
    setError('')
    setSendingOtp(true)
    try {
      await requestPhoneOtp(phone)
      setOtpSent(true)
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Could not send OTP'))
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    try {
      await loginWithPhone(phone, otp)
      navigate(afterLoginPath, { state: afterLoginState })
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Invalid OTP'))
    }
  }

  const handleGuest = () => {
    setError('')
    continueAsGuest()
    navigate(sanitizeGuestPath(afterLoginPath), { replace: true, state: afterLoginState })
  }

  return (
    <div className="login-screen relative flex min-h-dvh flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-14 sm:pt-16">
        <div className="login-animate-up mb-10 flex flex-col items-center" style={{ animationDelay: '0.05s' }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#137A63] text-white shadow-sm">
            <BrandMark size={22} />
          </div>
          <span className="mt-3 text-xs font-bold tracking-[0.18em] text-[#137A63]">
            {t('loginBrandName')}
          </span>
        </div>

        <div className="login-animate-up mb-8" style={{ animationDelay: '0.12s' }}>
          <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-black sm:text-[2.125rem]">
            {t('tagline')}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#707070]">
            {t('taglineSub')}
          </p>
        </div>

        <div className="login-animate-up mb-8 grid grid-cols-2 gap-3" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            onClick={() => setServiceMode('property')}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-5 text-sm font-bold transition-colors ${
              serviceMode === 'property'
                ? 'bg-[#137A63] text-white shadow-sm'
                : 'border border-[#E5E5E5] bg-white text-black'
            }`}
          >
            <Icon name="home" size={22} className={serviceMode === 'property' ? 'text-white' : 'text-black'} />
            {t('buySellRent')}
          </button>
          <button
            type="button"
            onClick={() => setServiceMode('services')}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-5 text-sm font-bold transition-colors ${
              serviceMode === 'services'
                ? 'bg-[#137A63] text-white shadow-sm'
                : 'border border-[#E5E5E5] bg-white text-black'
            }`}
          >
            <Icon name="key" size={22} className={serviceMode === 'services' ? 'text-white' : 'text-black'} />
            {t('localServices')}
          </button>
        </div>

        <div className="login-animate-up flex flex-1 flex-col space-y-3" style={{ animationDelay: '0.28s' }}>
          {showPhoneAuth ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowPhoneAuth(false)
                  setOtpSent(false)
                  setPhone('')
                  setOtp('')
                  setError('')
                }}
                className="flex items-center gap-1 text-sm font-medium text-[#707070] hover:text-black"
              >
                <Icon name="arrow_back" size={18} />
                {t('back')}
              </button>

              {!otpSent ? (
                <>
                  <input
                    type="tel"
                    placeholder={t('enterPhone')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-full border border-[#E5E5E5] bg-white px-5 py-4 text-sm outline-none focus:border-[#137A63]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="flex w-full items-center justify-center rounded-full bg-black py-4 px-6 text-sm font-bold text-white transition-colors hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingOtp ? t('sendingOtp') : t('sendOtp')}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-center text-sm text-[#707070]">{t('otpSent')}</p>
                  <input
                    type="text"
                    placeholder={t('enterOtp')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full rounded-full border border-[#E5E5E5] bg-white px-5 py-4 text-center text-sm tracking-widest outline-none focus:border-[#137A63]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-full bg-black py-4 px-6 text-sm font-bold text-white transition-colors hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('verifyOtp')}
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E5E5E5] bg-white py-4 px-6 text-sm font-bold text-black transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <GoogleIcon />
                {t('continueGoogle')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError('')
                  setShowPhoneAuth(true)
                }}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 px-6 text-sm font-bold text-white transition-colors hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="call" size={20} className="text-white" />
                {t('continuePhone')}
              </button>
            </>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleGuest}
            className="pt-1 text-center text-sm font-medium text-[#707070] underline-offset-2 hover:text-black hover:underline"
          >
            {t('continueGuest')}
          </button>
        </div>

        <div className="login-animate-in mt-10" style={{ animationDelay: '0.4s' }}>
          <LoginFooter />
          {import.meta.env.DEV && (
            <p className="mt-2 text-center text-xs text-[#94A3B8]">{t('demoNote')}</p>
          )}
        </div>

        <div id="recaptcha-container" className="sr-only" aria-hidden />
      </div>
    </div>
  )
}
