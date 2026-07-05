import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BackButton from '../components/BackButton'
import WhatsAppIcon from '../components/icons/WhatsAppIcon'
import DegradedDataBanner from '../components/DegradedDataBanner'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { LOCAL_SERVICES, SERVICE_COLORS, getServiceIcon } from '../data/localServices'
import {
  getStaticProvidersForService,
  getProviderWhatsAppUrl,
} from '../data/serviceProviders'
import {
  fetchServiceCategory,
  fetchServiceProviders,
  getOrCreateServiceConversation,
  createSupportTicket,
} from '../services/dataApi'
import { isGuestUser, maskPersonName, maskPhoneNumber } from '../utils/pii'
import { providerMatchesLocation, sortProvidersByLocation } from '../utils/serviceLocation'
import useBrowseLocation from '../hooks/useBrowseLocation'
import { canContact, recordContact } from '../utils/contactRateLimit'

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const guest = isGuestUser(user)
  const { location } = useBrowseLocation(user, setUser)

  const [service, setService] = useState(() => LOCAL_SERVICES.find((s) => s.id === id) ?? null)
  const [providers, setProviders] = useState(() => getStaticProvidersForService(id))
  const [selectedProviderId, setSelectedProviderId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [category, firestoreProviders] = await Promise.all([
          fetchServiceCategory(id),
          fetchServiceProviders(id),
        ])
        if (cancelled) return
        if (category) setService(category)
        if (firestoreProviders.length > 0) {
          setProviders(firestoreProviders)
          setUsingFallback(false)
        } else {
          setProviders(getStaticProvidersForService(id))
          setUsingFallback(true)
        }
      } catch {
        if (!cancelled) {
          setService(LOCAL_SERVICES.find((s) => s.id === id) ?? null)
          setProviders(getStaticProvidersForService(id))
          setUsingFallback(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const sortedProviders = useMemo(
    () => sortProvidersByLocation(providers, location),
    [providers, location],
  )

  const provider = useMemo(() => {
    if (!sortedProviders.length) return null
    if (selectedProviderId) {
      return sortedProviders.find((p) => p.id === selectedProviderId) || sortedProviders[0]
    }
    const localMatch = sortedProviders.find((p) => providerMatchesLocation(p, location))
    return localMatch || sortedProviders[0]
  }, [sortedProviders, selectedProviderId, location])

  useEffect(() => {
    setPhoneRevealed(false)
  }, [provider?.id])

  if (loading) {
    return (
      <div className="px-5 pt-6 space-y-4 animate-pulse lg:max-w-3xl lg:mx-auto">
        <div className="h-6 w-32 rounded bg-surface" />
        <div className="h-10 w-full rounded-2xl bg-surface" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-surface" />
          ))}
        </div>
        <div className="h-24 rounded-2xl bg-surface" />
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
  const whatsappUrl = getProviderWhatsAppUrl(
    provider.provider.whatsapp,
    `${t('serviceWhatsAppPrefix')} ${t(service.titleKey)}.`,
  )
  const contactKey = `service-${provider.id}`

  const promptSignIn = () => {
    navigate('/login', { state: { from: `/services/${id}` } })
  }

  const handleWhatsApp = () => {
    if (!whatsappUrl) return
    if (!canContact(contactKey)) return
    recordContact(contactKey)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCallReveal = () => {
    if (guest) {
      promptSignIn()
      return
    }
    if (!canContact(`${contactKey}-call`)) return
    recordContact(`${contactKey}-call`)
    setPhoneRevealed(true)
  }

  const handleMessage = async () => {
    if (guest) {
      promptSignIn()
      return
    }
    if (!user?.id || !canContact(`${contactKey}-msg`)) return
    recordContact(`${contactKey}-msg`)
    const conv = await getOrCreateServiceConversation(user.id, provider, service.titleKey)
    navigate(`/messages/${conv.id}`)
  }

  const handleReport = async () => {
    if (guest) {
      promptSignIn()
      return
    }
    if (!user?.id || reportSent) return
    await createSupportTicket(
      user.id,
      t('reportProviderSubject').replace('{name}', provider.provider.name),
      t('reportProviderMessage')
        .replace('{service}', t(service.titleKey))
        .replace('{provider}', provider.provider.name)
        .replace('{id}', provider.id),
    )
    setReportSent(true)
  }

  const showRating = provider.reviewCount > 0 && provider.rating > 0

  return (
    <div className="lg:max-w-3xl lg:mx-auto bg-white pb-28">
      <div className="px-5 pt-2 lg:pt-4">
        <h1 className="text-base font-bold text-text">{t('serviceDetails')}</h1>
      </div>

      {usingFallback && (
        <div className="mx-5 mt-3 lg:mx-8">
          <DegradedDataBanner />
        </div>
      )}

      {guest && (
        <div className="mx-5 mt-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted lg:mx-8">
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
            <Icon
              name={getServiceIcon(service.id, service.icon)}
              size={32}
              filled
              style={{ color: palette.dot }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-text">{t(service.titleKey)}</h2>
            <p className="mt-0.5 text-sm text-muted">{t(service.subtitleKey)}</p>
            {showRating ? (
              <div className="mt-2 flex items-center gap-1.5 text-sm">
                <Icon name="star" size={16} filled className="text-accent" />
                <span className="font-semibold text-text">{provider.rating}</span>
                <span className="text-muted">
                  ({provider.reviewCount} {t('reviews')})
                </span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted">{t('newProvider')}</p>
            )}
          </div>
        </div>

        {sortedProviders.length > 1 && (
          <div className="mt-5">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">{t('chooseProvider')}</p>
            <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {sortedProviders.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProviderId(item.id)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    provider.id === item.id
                      ? 'border-teal bg-teal-light text-teal'
                      : 'border-border text-muted hover:border-teal/40'
                  }`}
                >
                  {guest ? maskPersonName(item.provider.name) : item.provider.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
            <p className="text-lg font-bold text-text">{provider.experience}</p>
            <p className="mt-0.5 text-xs text-muted">{t('experience')}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-3 py-4 text-center">
            <p className="text-lg font-bold text-text">
              {provider.availableNow ? t('availableNow') : provider.availability}
            </p>
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
              {provider.verified ? t('verifiedProvider') : t('unverifiedProvider')} · {t(provider.provider.locationKey)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReport}
            disabled={reportSent}
            className="shrink-0 text-xs font-medium text-muted underline underline-offset-2 disabled:opacity-50"
          >
            {reportSent ? t('reportSubmitted') : t('reportProvider')}
          </button>
        </div>
      </div>

      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 flex items-center gap-3 border-t border-border bg-white px-5 py-3 lg:static lg:mt-8 lg:border-0 lg:px-8 lg:pb-0">
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!whatsappUrl}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label={t('contactWhatsApp')}
        >
          <WhatsAppIcon />
        </button>

        {!guest && phoneRevealed && provider.provider.phone ? (
          <a
            href={`tel:${provider.provider.phone}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white"
            aria-label={t('call')}
          >
            <Icon name="phone" size={20} />
          </a>
        ) : (
          <button
            type="button"
            onClick={handleCallReveal}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white"
            aria-label={t('call')}
            title={guest ? maskPhoneNumber('9999999999') : t('tapToRevealPhone')}
          >
            <Icon name="phone" size={20} className={guest ? 'text-muted' : ''} />
          </button>
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
