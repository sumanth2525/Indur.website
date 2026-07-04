import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatListedAgo, formatPropertySummary } from '../services/storage'
import { DEFAULT_PROPERTY_IMAGE } from '../data/mockImages'
import {
  getPropertyById,
  getUserById,
  incrementPropertyViews,
  toggleSaved,
  getOrCreateConversation,
  getPropertySaveCount,
} from '../data/seed'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const [property, setProperty] = useState(() => getPropertyById(id))
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    if (property) incrementPropertyViews(property.id)
  }, [property?.id])

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <p className="text-muted">Property not found</p>
        <button type="button" onClick={() => navigate('/')} className="mt-4 text-sm font-medium underline">
          {t('back')}
        </button>
      </div>
    )
  }

  const seller = getUserById(property.sellerId)
  const isSaved = user?.saved?.includes(property.id)
  const saveCount = getPropertySaveCount(property.id)
  const images = property.images?.length ? property.images : [DEFAULT_PROPERTY_IMAGE]

  const handleContact = () => {
    if (!user) return
    const conv = getOrCreateConversation(user.id, property.sellerId, property.id)
    navigate(`/messages/${conv.id}`)
  }

  const handleSave = () => {
    toggleSaved(user.id, property.id)
    refreshUser()
  }

  return (
    <div className="lg:max-w-3xl lg:mx-auto bg-white">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="lg:hidden flex items-center gap-1 text-sm text-muted mb-3 px-5 pt-2"
      >
        <Icon name="arrow_back" size={18} /> {t('back')}
      </button>

      <div className="lg:rounded-2xl lg:border lg:border-border lg:overflow-hidden">
        <div className="relative aspect-[16/10] lg:aspect-[16/9] bg-surface">
          <img src={images[imgIndex]} alt={property.title} className="h-full w-full object-cover" />
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
          <button
            type="button"
            onClick={handleSave}
            className={`absolute top-3 right-3 flex flex-col items-center rounded-lg border px-2.5 py-1.5 shadow-sm transition-colors ${
              isSaved ? 'border-text bg-text text-white' : 'border-border-strong bg-white/95 text-muted'
            }`}
          >
            <Icon name="keyboard_arrow_up" size={16} filled={isSaved} />
            <span className="text-xs font-medium tabular-nums">{saveCount}</span>
          </button>
        </div>

        <div className="px-5 py-5 lg:p-8">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
            {t(property.type)} · {formatListedAgo(property.createdAt, t)}
          </p>
          <p className="text-2xl lg:text-3xl font-bold mt-2 tracking-tight">{formatPrice(property.price)}</p>
          <p className="text-muted text-sm mt-2">{formatPropertySummary(property, t)}</p>
          <p className="text-sm mt-1 flex items-center gap-1 text-muted">
            <Icon name="location_on" size={14} />
            {property.location?.area}, {property.location?.city}
          </p>

          {property.readyToMove && (
            <span className="inline-block mt-4 rounded-full border border-border px-3 py-1 text-xs font-medium">
              {t('readyToMove')}
            </span>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="font-semibold text-sm mb-2">{t('description')}</h2>
            <p className="text-muted text-sm leading-relaxed">{property.description}</p>
          </div>

          {seller && (
            <div className="mt-6 flex items-center justify-between border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-text text-white font-semibold text-sm">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{seller.name}</p>
                  <p className="text-muted text-xs">{t('verifiedSeller')}</p>
                </div>
              </div>
              <button type="button" onClick={handleContact} className="rounded-full border border-border p-2.5 hover:bg-surface">
                <Icon name="chat" size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 border-t border-border bg-white px-5 py-3 flex gap-3 lg:static lg:border-0 lg:mt-6 lg:px-0 lg:pb-0">
        <a
          href={`tel:${seller?.phone || ''}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong"
        >
          <Icon name="phone" size={20} />
        </a>
        <button
          type="button"
          onClick={handleContact}
          className="flex-1 rounded-full bg-text py-3 font-medium text-white hover:bg-black transition-colors"
        >
          {t('contactSeller')}
        </button>
      </div>
    </div>
  )
}
