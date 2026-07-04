import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Bell, Search } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storage } from '../services/storage'
import { toggleSaved } from '../data/seed'
import { LOCATIONS } from '../i18n/translations'
import PropertyCard from '../components/PropertyCard'

const CATEGORIES = ['all', 'house', 'land', 'apartment']

export default function Home() {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(() => storage.getLocation())
  const [mode, setMode] = useState('buy')
  const [category, setCategory] = useState('all')
  const [properties, setProperties] = useState(() => storage.getProperties())
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== 'active') return false
      if (category !== 'all' && p.type !== category) return false
      if (location !== 'Nizamabad' && p.location?.area !== location && p.location?.city !== location) {
        if (location !== 'Nizamabad') return p.location?.area === location || p.location?.city === location
      }
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [properties, category, location, search])

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

  if (mode === 'sell') {
    navigate('/post')
    setMode('buy')
  }

  return (
    <div className="px-4 lg:px-0">
      {/* Mobile header */}
      <div className="lg:hidden pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <select
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="appearance-none rounded-full border border-border bg-white pl-8 pr-8 py-2 text-sm font-medium outline-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal pointer-events-none" />
          </div>
          <button type="button" className="rounded-full p-2 hover:bg-surface">
            <Bell size={22} className="text-text" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted tracking-widest">{t('explore')}</p>
            <h1 className="text-2xl font-bold">{t('properties')}</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/post')}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-surface"
          >
            + {t('post')}
          </button>
        </div>
      </div>

      {/* Desktop dashboard header */}
      <div className="hidden lg:block mb-8">
        <p className="text-muted text-sm">{t('welcomeBack')}, {user?.name}</p>
        <h1 className="text-3xl font-bold mt-1">{t('dashboard')}</h1>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-muted text-sm">{t('activeListings')}</p>
            <p className="text-3xl font-bold mt-1">{myListings.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-muted text-sm">{t('saved')}</p>
            <p className="text-3xl font-bold mt-1">{user?.saved?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-muted text-sm">{t('totalViews')}</p>
            <p className="text-3xl font-bold mt-1">{totalViews}</p>
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <select
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-white pl-9 pr-8 py-2.5 text-sm font-medium outline-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal pointer-events-none" />
          </div>
        </div>

        <div className="flex rounded-full bg-surface p-1 w-fit">
          <button
            type="button"
            onClick={() => setMode('buy')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              mode === 'buy' ? 'bg-text text-white' : 'text-muted'
            }`}
          >
            {t('buy')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/post')}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              mode === 'sell' ? 'bg-text text-white' : 'text-muted'
            }`}
          >
            {t('sell')}
          </button>
        </div>

        <div className="hidden lg:flex relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={`${t('searchConversations').replace('conversations', 'properties')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-teal"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-teal text-white'
                : 'bg-white border border-border text-muted hover:border-teal'
            }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Property feed */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🏘️</div>
          <p className="font-medium">{t('noProperties')}</p>
          <p className="text-muted text-sm mt-1">{t('noPropertiesSub')}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:hidden">
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={user?.saved?.includes(p.id)}
                onToggleSave={handleToggleSave}
                layout="list"
              />
            ))}
          </div>
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                isSaved={user?.saved?.includes(p.id)}
                onToggleSave={handleToggleSave}
                layout="grid"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
