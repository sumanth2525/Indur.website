import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BackButton from '../components/BackButton'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatListedAgo, formatPropertySummary } from '../services/formatters'
import { DEFAULT_PROPERTY_IMAGE } from '../data/mockImages'
import ViewCountBadge from '../components/ViewCountBadge'
import {
  bumpListingViews,
  fetchListingById,
  fetchPublicProfileById,
  getOrCreateConversation,
} from '../services/dataApi'
import { trackContactSeller, trackPropertyView } from '../services/analytics'
import {
  formatListingLocation,
  isAuthenticatedUser,
  isGuestUser,
  maskListingText,
  maskPersonName,
  maskPhoneNumber,
} from '../utils/pii'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const guest = isGuestUser(user)
  const authenticated = isAuthenticatedUser(user)
  const [property, setProperty] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const listing = await fetchListingById(id)
      if (!active) return
      if (listing) {
        if (authenticated) bumpListingViews(listing.id)
        trackPropertyView(listing)
        setProperty({ ...listing, views: (listing.views || 0) + (authenticated ? 1 : 0) })
        if (authenticated) {
          const profile = await fetchPublicProfileById(listing.sellerId)
          if (active) setSeller(profile)
        } else {
          setSeller(null)
        }
      } else {
        setProperty(null)
        setSeller(null)
      }
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [id, authenticated])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <p className="text-muted">{t('loading')}</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <p className="text-muted">{t('propertyNotFound')}</p>
        <BackButton fallback="/browse" showLabel className="mt-4 px-0 hover:bg-transparent" />
      </div>
    )
  }

  const images = property.images?.length ? property.images : [DEFAULT_PROPERTY_IMAGE]
  const locationLabel = formatListingLocation(property.location, guest)
  const description = guest ? maskListingText(property.description) : property.description
  const sellerName = guest ? maskPersonName(seller?.name) : seller?.name
  const sellerPhone = guest ? null : seller?.contactPhone || null

  const promptSignIn = () => {
    navigate('/login', { state: { from: `/property/${property.id}` } })
  }

  const handleContact = async () => {
    if (guest) {
      promptSignIn()
      return
    }
    if (!user?.id) return
    trackContactSeller(property.id)
    const conv = await getOrCreateConversation(user.id, property.sellerId, property.id)
    navigate(`/messages/${conv.id}`)
  }

  return (
    <div className="lg:max-w-3xl lg:mx-auto bg-white">
      {guest && (
        <div className="mx-5 mb-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted lg:mx-0">
          {t('guestPiiNotice')}{' '}
          <button type="button" onClick={promptSignIn} className="font-medium text-text underline underline-offset-2">
            {t('login')}
          </button>
        </div>
      )}

      <div className="lg:rounded-2xl lg:border lg:border-border lg:overflow-hidden">
        <div className="relative aspect-[16/10] lg:aspect-[16/9] bg-surface">
          <img src={images[imgIndex]} alt={property.title} className="h-full w-full object-cover" loading="lazy" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm"
              >
                <Icon name="chevron_right" size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-3 right-3">
            <ViewCountBadge count={property.views} className="shadow-sm" />
          </div>
        </div>

        <div className="px-5 py-5 lg:p-8">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
            {t(property.type)} · {formatListedAgo(property.createdAt, t)}
          </p>
          <p className="text-2xl lg:text-3xl font-bold mt-2 tracking-tight">{formatPrice(property.price)}</p>
          <p className="text-muted text-sm mt-2">{formatPropertySummary(property, t)}</p>
          <p className="text-sm mt-1 flex items-center gap-1 text-muted">
            <Icon name="location_on" size={14} />
            {locationLabel}
          </p>

          {property.readyToMove && (
            <span className="inline-block mt-4 rounded-full border border-border px-3 py-1 text-xs font-medium">
              {t('readyToMove')}
            </span>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="font-semibold text-sm mb-2">{t('description')}</h2>
            <p className="text-muted text-sm leading-relaxed">{description}</p>
          </div>

          <div className="mt-6 flex items-center justify-between border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-text text-white font-semibold text-sm">
                {(sellerName || t('maskedSeller')).charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{sellerName || t('maskedSeller')}</p>
                <p className="text-muted text-xs">
                  {guest ? t('signInForSellerDetails') : t('verifiedSeller')}
                </p>
              </div>
            </div>
            <button type="button" onClick={handleContact} className="rounded-full border border-border p-2.5 hover:bg-surface">
              <Icon name="chat" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 border-t border-border bg-white px-5 py-3 flex gap-3 lg:static lg:border-0 lg:mt-6 lg:px-0 lg:pb-0">
        {!guest && sellerPhone && (
          <a
            href={`tel:${sellerPhone}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong"
            aria-label={t('call')}
          >
            <Icon name="phone" size={20} />
          </a>
        )}
        {guest && (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong text-muted"
            aria-hidden
            title={maskPhoneNumber('9999999999')}
          >
            <Icon name="phone" size={20} />
          </div>
        )}
        <button
          type="button"
          onClick={handleContact}
          className="flex-1 rounded-full bg-text py-3 font-medium text-white hover:bg-black transition-colors"
        >
          {guest ? t('signInToContact') : t('contactSeller')}
        </button>
      </div>
    </div>
  )
}

