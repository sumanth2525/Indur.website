import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'

const BRAND_ICONS = [
  { name: 'home', top: '10%', left: '6%', size: 36, rotate: -12 },
  { name: 'key', top: '18%', right: '10%', size: 28, rotate: 18 },
  { name: 'location_on', top: '52%', left: '8%', size: 32, rotate: -6 },
  { name: 'apartment', top: '62%', right: '7%', size: 40, rotate: 8 },
  { name: 'park', top: '78%', left: '14%', size: 30, rotate: -4 },
]

const PROPERTY_TYPES = [
  { icon: 'home', labelKey: 'house' },
  { icon: 'landscape', labelKey: 'land' },
  { icon: 'agriculture', labelKey: 'agriculture' },
  { icon: 'apartment', labelKey: 'apartment' },
]

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
      {/* Brand panel — desktop */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-text relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {BRAND_ICONS.map(({ name, top, left, right, size, rotate }, i) => (
            <Icon
              key={i}
              name={name}
              size={size}
              className="absolute text-white/[0.06]"
              style={{ top, left, right, transform: `rotate(${rotate}deg)` }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Icon name="home" size={24} className="text-white" filled />
            </div>
            <span className="font-bold tracking-[0.12em] text-white text-sm">{t('appName')}</span>
          </div>

          <div className="max-w-lg">
            <h1 className="text-[2.75rem] xl:text-5xl font-bold text-white leading-[1.12] tracking-tight">
              {t('tagline')}
            </h1>
            <p className="mt-5 text-white/65 text-lg leading-relaxed">{t('taglineSub')}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {PROPERTY_TYPES.map(({ icon, labelKey }) => (
              <div
                key={labelKey}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] ring-1 ring-white/10 px-4 py-2 text-sm text-white/90"
              >
                <Icon name={icon} size={18} className="text-white/80" />
                {t(labelKey)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-16 xl:px-24">
        <div className="absolute top-5 right-5 lg:top-8 lg:right-8">
          <LanguageToggle />
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-text text-white">
                <Icon name="home" size={20} filled />
              </div>
              <span className="font-bold tracking-[0.08em] text-sm">{t('appName')}</span>
            </div>
          </div>

          <div className="lg:mb-10">
            <h2 className="text-3xl font-bold leading-tight tracking-tight lg:hidden">{t('tagline')}</h2>
            <h2 className="hidden lg:block text-[2rem] xl:text-[2.25rem] font-bold leading-tight tracking-tight">
              {t('login')}
            </h2>
            <p className="text-muted mt-2 text-sm lg:mt-3 lg:text-base lg:leading-relaxed">
              <span className="lg:hidden">{t('taglineSub')}</span>
              <span className="hidden lg:inline">{t('loginSubtitle')}</span>
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border-strong bg-white py-3.5 px-6 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50 lg:py-4"
            >
              <GoogleIcon />
              {t('continueGoogle')}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-muted-light">
                  {t('orDivider')}
                </span>
              </div>
            </div>

            {!otpSent ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder={t('enterPhone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-full border border-border-strong px-5 py-3.5 text-sm outline-none focus:border-text lg:py-4"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-text py-3.5 px-6 text-sm font-medium text-white hover:bg-black transition-colors lg:py-4"
                >
                  <Icon name="phone" size={18} />
                  {t('sendOtp')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted text-center">{t('otpSent')}</p>
                <input
                  type="text"
                  placeholder={t('enterOtp')}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full rounded-full border border-border-strong px-5 py-3.5 text-sm text-center tracking-widest outline-none focus:border-text lg:py-4"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-text py-3.5 px-6 text-sm font-medium text-white hover:bg-black transition-colors disabled:opacity-50 lg:py-4"
                >
                  <Icon name="phone" size={18} />
                  {t('verifyOtp')}
                </button>
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

          <p className="mt-8 text-xs text-muted text-center leading-relaxed lg:mt-10">{t('terms')}</p>
          <p className="mt-2 text-xs text-muted-light text-center">{t('demoNote')}</p>
        </div>
      </div>
    </div>
  )
}
