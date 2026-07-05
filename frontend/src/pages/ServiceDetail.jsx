import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { LOCAL_SERVICES, SERVICE_COLORS } from '../data/localServices'
import { getServiceProvider, getProviderWhatsAppUrl } from '../data/serviceProviders'
import { fetchServiceCategory, fetchPrimaryServiceProvider } from '../services/dataApi'
import { isGuestUser, maskPersonName, maskPhoneNumber } from '../utils/pii'

function WhatsAppIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const guest = isGuestUser(user)

  const [service, setService] = useState(() => LOCAL_SERVICES.find((s) => s.id === id) ?? null)
  const [provider, setProvider] = useState(() => getServiceProvider(id))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [category, firestoreProvider] = await Promise.all([
          fetchServiceCategory(id),
          fetchPrimaryServiceProvider(id),
        ])
        if (cancelled) return
        if (category) setService(category)
        if (firestoreProvider) setProvider(firestoreProvider)
      } catch {
        if (!cancelled) {
          setService(LOCAL_SERVICES.find((s) => s.id === id) ?? null)
          setProvider(getServiceProvider(id))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <p className="text-muted">{t('loading')}</p>
      </div>
    )
  }

  if (!service || !provider) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <p className="text-muted">{t('serviceNotFound')}</p>
        <button type="button" onClick={() => navigate('/services')} className="mt-4 text-sm font-medium underline">
          {t('back')}
        </button>
      </div>
    )
  }

  const palette = SERVICE_COLORS[service.color] || SERVICE_COLORS.teal
  const providerName = guest ? maskPersonName(provider.provider.name) : provider.provider.name
  const providerPhone = guest ? null : provider.provider.phone
  const whatsappUrl = guest
    ? null
    : getProviderWhatsAppUrl(
        provider.provider.whatsapp,
        `${t('serviceWhatsAppPrefix')} ${t(service.titleKey)}.`,
      )

  const promptSignIn = () => {
    navigate('/login', { state: { from: `/services/${id}` } })
  }

  const handleMessage = () => {
    if (guest) {
      promptSignIn()
      return
    }
    navigate('/messages')
  }

  return (
    <div className="lg:max-w-3xl lg:mx-auto bg-white pb-28">
      <div className="flex items-center gap-2 px-5 pt-2 lg:pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text"
          aria-label={t('back')}
        >
          <Icon name="arrow_back" size={22} />
        </button>
        <h1 className="text-base font-bold text-text">{t('serviceDetails')}</h1>
      </div>

      {guest && (
        <div className="mx-5 mt-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted lg:mx-0">
          {t('guestServicePiiNotice')}{' '}
          <button type="button" onClick={promptSignIn} className="font-medium text-text underline underline-offset-2">
            {t('login')}
          </button>
        </div>
      )}

      <div className="px-5 pt-5 lg:px-8">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: palette.bg }}
          >
            <span
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: palette.dot }}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-text">{t(service.titleKey)}</h2>
            <p className="mt-0.5 text-sm text-muted">{t(service.subtitleKey)}</p>
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <Icon name="star" size={16} filled className="text-accent" />
              <span className="font-semibold text-text">{provider.rating}</span>
              <span className="text-muted">
                ({provider.reviewCount} {t('bookings')})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
            <p className="text-lg font-bold text-text">{provider.experience}</p>
            <p className="mt-0.5 text-xs text-muted">{t('experience')}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
            <p className="text-lg font-bold text-text">{provider.availability}</p>
            <p className="mt-0.5 text-xs text-muted">{t('availability')}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
            <p className="text-lg font-bold text-text">{provider.distance}</p>
            <p className="mt-0.5 text-xs text-muted">{t('away')}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-sm text-text">{t('about')}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t(provider.aboutKey)}</p>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-sm text-text">{t('servicesOffered')}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.servicesOfferedKeys.map((key) => (
              <span
                key={key}
                className="rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-text"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-text text-sm font-semibold text-white">
            {provider.provider.initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-text">{providerName}</p>
            <p className="text-xs text-muted">
              {t('verifiedProvider')} · {t(provider.provider.locationKey)}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 flex items-center gap-3 border-t border-border bg-white px-5 py-3 lg:static lg:mt-8 lg:border-0 lg:px-8 lg:pb-0">
        {guest ? (
          <button
            type="button"
            onClick={promptSignIn}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
            aria-label={t('contactWhatsApp')}
          >
            <WhatsAppIcon />
          </button>
        ) : whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90"
            aria-label={t('contactWhatsApp')}
          >
            <WhatsAppIcon />
          </a>
        ) : null}

        {!guest && providerPhone ? (
          <a
            href={`tel:${providerPhone}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white"
            aria-label={t('call')}
          >
            <Icon name="phone" size={20} />
          </a>
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong text-muted"
            aria-hidden
            title={guest ? maskPhoneNumber('9999999999') : undefined}
          >
            <Icon name="phone" size={20} />
          </div>
        )}

        <button
          type="button"
          onClick={handleMessage}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-text py-3 font-medium text-white transition-colors hover:bg-black"
        >
          <Icon name="chat" size={20} className="text-white" />
          {guest ? t('signInToMessage') : t('message')}
        </button>
      </div>
    </div>
  )
}
