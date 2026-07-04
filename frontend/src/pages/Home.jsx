import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storage } from '../services/storage'
import { toggleSaved } from '../data/seed'
import PropertyListItem, { PropertyGridCard } from '../components/PropertyListItem'
import BackgroundDecor from '../components/BackgroundDecor'
import LanguageToggle from '../components/LanguageToggle'
import LocationPicker from '../components/LocationPicker'
import Import99AcresButton from '../components/Import99AcresButton'

const CATEGORIES = ['all', 'house', 'land', 'agriculture', 'apartment']

export default function Home() {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(() => storage.getLocation())
  const [purpose, setPurpose] = useState('sell')
  const [category, setCategory] = useState('all')
  const [properties, setProperties] = useState(() => storage.getProperties())
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== 'active') return false
      if (purpose === 'sell' && p.purpose && p.purpose !== 'sell') return false
      if (purpose === 'rent' && p.purpose !== 'rent') return false
      if (category !== 'all' && p.type !== category) return false
      if (location !== 'Nizamabad' && p.location?.area !== location && p.location?.city !== location) {
        if (location !== 'Nizamabad') return p.location?.area === location || p.location?.city === location
      }
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [properties, category, location, search, purpose])

  const handleLocationChange = (loc) => {
    setLocation(loc)
    storage.setLocation(loc)
  }

  const handleToggleSave = (propertyId) => {
    toggleSaved(user.id, propertyId)
    refreshUser()
  }

  const myListings = properties.filter((p) => p.sellerId === user?.id && p.status === 'active')
  const totalViews = myListings.reduce((sum, p) => sum + (p.views || 0), 0)

  return (
    <div className="relative min-h-full bg-white">
      <BackgroundDecor />

      {/* Mobile — reference layout */}
      <div className="relative lg:hidden px-5 pt-6 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
              {t('trendingToday')}
            </p>
            <h1 className="text-[2rem] font-bold leading-tight tracking-tight mt-1">{t('properties')}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageToggle className="!px-2.5 !py-1 !text-xs" />
            <button
              type="button"
              onClick={() => navigate('/post')}
              className="rounded-full border border-border-strong px-4 py-1.5 text-sm font-medium hover:bg-surface transition-colors"
            >
              + {t('post')}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <LocationPicker value={location} onChange={handleLocationChange} />
        </div>

        <div className="mt-3 inline-flex rounded-full border border-border-strong p-0.5">
          <button
            type="button"
            onClick={() => setPurpose('sell')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              purpose === 'sell' ? 'bg-text text-white' : 'text-text hover:bg-surface'
            }`}
          >
            {t('forSale')}
          </button>
          <button
            type="button"
            onClick={() => setPurpose('rent')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              purpose === 'rent' ? 'bg-text text-white' : 'text-text hover:bg-surface'
            }`}
          >
            {t('forRent')}
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-text text-white'
                  : 'border border-border text-muted hover:border-border-strong'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="mt-4 mb-2">
          <Import99AcresButton
            location={location}
            purpose={purpose}
            onImported={() => setProperties(storage.getProperties())}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-medium text-[15px]">{t('noProperties')}</p>
            <p className="text-muted text-sm mt-1.5 max-w-xs">{t('noPropertiesSub')}</p>
            {purpose === 'rent' && (
              <button
                type="button"
                onClick={() => setPurpose('sell')}
                className="mt-4 text-sm font-medium underline underline-offset-2"
              >
                {t('forSale')}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-2">
            {filtered.map((p, i) => (
              <PropertyListItem
                key={p.id}
                property={p}
                isSaved={user?.saved?.includes(p.id)}
                onToggleSave={handleToggleSave}
                showDivider={i < filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop dashboard */}
      <div className="hidden lg:block">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
              {t('welcomeBack')}, {user?.name}
            </p>
            <h1 className="text-4xl font-bold tracking-tight mt-1">{t('properties')}</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/post')}
            className="rounded-full border border-border-strong px-5 py-2 text-sm font-medium hover:bg-surface transition-colors"
          >
            + {t('postProperty')}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border p-5">
            <p className="text-muted text-sm">{t('activeListings')}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{myListings.length}</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <p className="text-muted text-sm">{t('saved')}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{user?.saved?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-border p-5">
            <p className="text-muted text-sm">{t('totalViews')}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{totalViews}</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <LocationPicker value={location} onChange={handleLocationChange} />
          <div className="inline-flex rounded-full border border-border-strong p-0.5">
            <button
              type="button"
              onClick={() => setPurpose('sell')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                purpose === 'sell' ? 'bg-text text-white' : 'text-text hover:bg-surface'
              }`}
            >
              {t('forSale')}
            </button>
            <button
              type="button"
              onClick={() => setPurpose('rent')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                purpose === 'rent' ? 'bg-text text-white' : 'text-text hover:bg-surface'
              }`}
            >
              {t('forRent')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={`${t('searchConversations').replace('conversations', 'properties')}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border pl-9 pr-4 py-2 text-sm outline-none focus:border-text"
            />
          </div>

          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-text text-white'
                    : 'border border-border text-muted hover:border-border-strong'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <Import99AcresButton
            location={location}
            purpose={purpose}
            onImported={() => setProperties(storage.getProperties())}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-2xl">
            <p className="font-medium">{t('noProperties')}</p>
            <p className="text-muted text-sm mt-1">{t('noPropertiesSub')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PropertyGridCard
                key={p.id}
                property={p}
                isSaved={user?.saved?.includes(p.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
