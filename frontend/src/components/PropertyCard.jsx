import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { formatPrice } from '../services/storage'
import { TYPE_COLORS } from '../data/seed'

export default function PropertyCard({ property, isSaved, onToggleSave, layout = 'list' }) {
  const { t } = useLanguage()
  const typeClass = TYPE_COLORS[property.type] || 'bg-gray-100 text-gray-700'

  if (layout === 'grid') {
    return (
      <Link
        to={`/property/${property.id}`}
        className="group block rounded-2xl border border-border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeClass}`}>
            {t(property.type)}
          </span>
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onToggleSave(property.id) }}
              className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white"
            >
              <Heart size={18} className={isSaved ? 'fill-red-500 text-red-500' : 'text-muted'} />
            </button>
          )}
        </div>
        <div className="p-4">
          <p className="font-bold text-lg">{formatPrice(property.price)}</p>
          <p className="font-medium text-sm mt-0.5 line-clamp-1">{property.title}</p>
          <p className="text-muted text-xs mt-1 flex items-center gap-1">
            <MapPin size={12} />
            {property.location?.area}, {property.location?.city}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/property/${property.id}`}
      className="flex gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
          alt={property.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeClass}`}>
            {t(property.type)}
          </span>
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onToggleSave(property.id) }}
              className="shrink-0 p-1"
            >
              <Heart size={18} className={isSaved ? 'fill-red-500 text-red-500' : 'text-muted'} />
            </button>
          )}
        </div>
        <p className="font-semibold text-sm mt-1 line-clamp-1">{property.title}</p>
        <p className="text-muted text-xs mt-0.5 flex items-center gap-1">
          <MapPin size={11} />
          {property.location?.area}
        </p>
        <p className="font-bold text-sm mt-1">{formatPrice(property.price)}</p>
      </div>
    </Link>
  )
}
