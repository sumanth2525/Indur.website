import { Link } from 'react-router-dom'
import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { formatPrice, formatListedAgo, formatPropertySummary } from '../services/storage'
import { getPropertySaveCount } from '../data/seed'
import { DEFAULT_PROPERTY_IMAGE } from '../data/mockImages'

const THUMB_COLORS = [
  'bg-sky-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
]

function thumbColor(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return THUMB_COLORS[Math.abs(hash) % THUMB_COLORS.length]
}

export default function PropertyListItem({ property, isSaved, onToggleSave, showDivider = true }) {
  const { t } = useLanguage()
  const saveCount = getPropertySaveCount(property.id)
  const image = property.images?.[0]
  const initial = (property.location?.area || property.title || 'P').charAt(0).toUpperCase()

  return (
    <div className={showDivider ? 'border-b border-border' : ''}>
      <div className="flex items-start gap-3.5 py-4">
        <Link to={`/property/${property.id}`} className="shrink-0">
          {image ? (
            <div className="h-14 w-14 overflow-hidden rounded-xl">
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-white ${thumbColor(property.id)}`}
            >
              {initial}
            </div>
          )}
        </Link>

        <Link to={`/property/${property.id}`} className="min-w-0 flex-1 pt-0.5">
          <p className="font-semibold text-[15px] leading-snug text-text">{formatPrice(property.price)}</p>
          <p className="mt-0.5 text-sm text-muted leading-snug line-clamp-2">
            {formatPropertySummary(property, t)}
          </p>
          <p className="mt-1 text-xs text-muted-light">
            {property.location?.area}, {property.location?.city}
            {' · '}
            {formatListedAgo(property.createdAt, t)}
          </p>
        </Link>

        <button
          type="button"
          onClick={() => onToggleSave?.(property.id)}
          className={`flex shrink-0 flex-col items-center justify-center rounded-lg border px-2.5 py-1.5 transition-colors ${
            isSaved
              ? 'border-text bg-text text-white'
              : 'border-border-strong bg-white text-muted hover:border-text hover:text-text'
          }`}
          aria-label={isSaved ? t('unsave') : t('save')}
        >
          <Icon name="keyboard_arrow_up" size={16} filled={isSaved} className={isSaved ? 'text-white' : ''} />
          <span className="text-xs font-medium tabular-nums leading-none mt-0.5">
            {saveCount + (isSaved ? 0 : 0)}
          </span>
        </button>
      </div>
    </div>
  )
}

export function PropertyGridCard({ property, isSaved, onToggleSave }) {
  const { t } = useLanguage()
  const saveCount = getPropertySaveCount(property.id)
  const image = property.images?.[0]

  return (
    <div className="group rounded-2xl border border-border bg-white overflow-hidden hover:border-border-strong transition-colors">
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <img
            src={image || DEFAULT_PROPERTY_IMAGE}
            alt={property.title}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="font-semibold text-lg">{formatPrice(property.price)}</p>
          <p className="text-sm text-muted mt-1 line-clamp-1">{formatPropertySummary(property, t)}</p>
          <p className="text-xs text-muted-light mt-1">
            {property.location?.area} · {formatListedAgo(property.createdAt, t)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4 flex justify-end">
        <button
          type="button"
          onClick={() => onToggleSave?.(property.id)}
          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
            isSaved ? 'border-text bg-text text-white' : 'border-border-strong text-muted hover:border-text'
          }`}
        >
          <Icon name="keyboard_arrow_up" size={14} filled={isSaved} />
          {saveCount}
        </button>
      </div>
    </div>
  )
}
