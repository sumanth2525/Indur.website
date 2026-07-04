import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, MessageCircle, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../services/storage'
import {
  getPropertyById,
  getUserById,
  incrementPropertyViews,
  toggleSaved,
  getOrCreateConversation,
  TYPE_COLORS,
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
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted">Property not found</p>
        <button type="button" onClick={() => navigate('/')} className="mt-4 text-teal">{t('back')}</button>
      </div>
    )
  }

  const seller = getUserById(property.sellerId)
  const isSaved = user?.saved?.includes(property.id)
  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800']
  const typeClass = TYPE_COLORS[property.type] || 'bg-gray-100 text-gray-700'

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
    <div className="lg:max-w-4xl lg:mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="lg:hidden flex items-center gap-1 text-sm text-muted mb-3 px-4 pt-2"
      >
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div className="lg:rounded-2xl lg:border lg:border-border lg:overflow-hidden lg:bg-white">
        {/* Image carousel */}
        <div className="relative aspect-[16/10] lg:aspect-[16/9] bg-gray-100">
          <img src={images[imgIndex]} alt={property.title} className="h-full w-full object-cover" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow"
              >
                <ChevronRight size={20} />
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
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2.5 shadow"
          >
            <Heart size={20} className={isSaved ? 'fill-red-500 text-red-500' : 'text-muted'} />
          </button>
        </div>

        <div className="px-4 py-5 lg:p-8">
          <div className="flex gap-2 mb-3">
            <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${typeClass}`}>
              {t(property.type)}
            </span>
            {property.readyToMove && (
              <span className="rounded-full bg-teal-light text-teal px-3 py-0.5 text-xs font-medium">
                {t('readyToMove')}
              </span>
            )}
          </div>

          <p className="text-2xl lg:text-3xl font-bold">{formatPrice(property.price)}</p>
          <h1 className="text-lg font-semibold mt-1">{property.title}</h1>
          <p className="text-muted text-sm mt-1 flex items-center gap-1">
            <MapPin size={14} className="text-teal" />
            {property.location?.area}, {property.location?.city}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {property.sqft > 0 && (
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="font-semibold text-sm">{property.sqft.toLocaleString()}</p>
                <p className="text-muted text-xs mt-0.5">{t('sqft')}</p>
              </div>
            )}
            {property.bedrooms > 0 && (
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="font-semibold text-sm">{property.bedrooms}</p>
                <p className="text-muted text-xs mt-0.5">{t('bedrooms')}</p>
              </div>
            )}
            {property.facing && (
              <div className="rounded-xl border border-border bg-surface p-3 text-center">
                <p className="font-semibold text-sm">{property.facing}</p>
                <p className="text-muted text-xs mt-0.5">{t('eastFacing').replace('East ', '')}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">{t('description')}</h2>
            <p className="text-muted text-sm leading-relaxed">{property.description}</p>
          </div>

          {seller && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal text-white font-semibold">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{seller.name}</p>
                  <p className="text-teal text-xs">{t('verifiedSeller')}</p>
                </div>
              </div>
              <button type="button" onClick={handleContact} className="rounded-full p-2 hover:bg-surface">
                <MessageCircle size={22} className="text-teal" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom actions - mobile */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-border bg-white px-4 py-3 flex gap-3 lg:static lg:border-0 lg:mt-6 lg:px-0 lg:pb-0">
        <a
          href={`tel:${seller?.phone || ''}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border"
        >
          <Phone size={20} />
        </a>
        <button
          type="button"
          onClick={handleContact}
          className="flex-1 rounded-full bg-teal py-3 font-medium text-white hover:bg-teal-dark transition-colors"
        >
          {t('contactSeller')}
        </button>
      </div>
    </div>
  )
}
