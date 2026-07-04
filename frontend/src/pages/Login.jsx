import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function Login() {
  const { user, loginWithGoogle, loginWithPhone, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch {
      setError('Login failed')
    }
  }

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Enter a valid phone number')
      return
    }
    setError('')
    setOtpSent(true)
  }

  const handleVerifyOtp = async () => {
    setError('')
    try {
      await loginWithPhone(phone, otp)
      navigate('/')
    } catch {
      setError('Invalid OTP. Use 123456 for demo.')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-teal items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="text-5xl mb-6">🏠</div>
          <h1 className="text-4xl font-bold mb-4">{t('appName')}</h1>
          <p className="text-xl opacity-90">{t('tagline')}</p>
          <p className="mt-4 opacity-75">{t('taglineSub')}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
          <LanguageToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white text-xl">🏠</div>
            <span className="font-bold tracking-wide">{t('appName')}</span>
          </div>

          <h2 className="text-3xl font-bold leading-tight">{t('tagline')}</h2>
          <p className="text-muted mt-2 text-sm">{t('taglineSub')}</p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-white py-3.5 px-6 font-medium hover:bg-surface transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {t('continueGoogle')}
            </button>

            {!otpSent ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder={t('enterPhone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-full border border-border px-5 py-3.5 text-sm outline-none focus:border-teal"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-text py-3.5 px-6 font-medium text-white hover:bg-black transition-colors"
                >
                  <Phone size={18} />
                  {t('sendOtp')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-teal text-center">{t('otpSent')}</p>
                <input
                  type="text"
                  placeholder={t('enterOtp')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full rounded-full border border-border px-5 py-3.5 text-sm text-center tracking-widest outline-none focus:border-teal"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-text py-3.5 px-6 font-medium text-white hover:bg-black transition-colors disabled:opacity-50"
                >
                  <Phone size={18} />
                  {t('verifyOtp')}
                </button>
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

          <p className="mt-8 text-xs text-muted text-center leading-relaxed">{t('terms')}</p>
          <p className="mt-2 text-xs text-muted/70 text-center">{t('demoNote')}</p>
        </div>
      </div>
    </div>
  )
}
