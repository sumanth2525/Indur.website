import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import useBrowseLocation from '../hooks/useBrowseLocation'
import { browseLocationLabel } from '../services/formatters'
import { watchListings, fetchListings } from '../services/dataApi'
import { propertyMatchesLocation, divisionLocation, REVENUE_DIVISIONS } from '../data/nizamabadLocations'
import { BROWSE_CATEGORIES, propertyMatchesCategory, heroTypeToCategory } from '../data/browseFilters'
import PropertyListItem, { PropertyGridCard } from '../components/PropertyListItem'
import BackgroundDecor from '../components/BackgroundDecor'
import LocationPicker from '../components/LocationPicker'
import Import99AcresButton from '../components/Import99AcresButton'
import PurposeToggle, { browsePurposeToListing } from '../components/PurposeToggle'
import RotatingTagline from '../components/RotatingTagline'
import WhatsAppContactButton from '../components/WhatsAppContactButton'

export default function Home() {
  const { t } = useLanguage()
  const { user, setUser, isGuest, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const { location, handleLocationChange } = useBrowseLocation(user, setUser)
  const [purpose, setPurpose] = useState('buy')
  const [category, setCategory] = useState('all')
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    return watchListings(setProperties, (err) => console.error('Listings sync failed', err))
  }, [])

  useEffect(() => {
    const pending = routeLocation.state?.search
    if (!pending) return

    if (pending.intent === 'rent' || pending.intent === 'pg') setPurpose('rent')
    else if (pending.intent === 'buy') setPurpose('buy')

    if (pending.propType) setCategory(heroTypeToCategory(pending.propType))

    const division = REVENUE_DIVISIONS.find(
      (d) => d.name.toLowerCase() === String(pending.city || '').toLowerCase(),
    )
    if (division) setLocation(divisionLocation(division.id))

    if (pending.query) setSearch(String(pending.query).split(',')[0].trim())

    navigate(routeLocation.pathname, { replace: true, state: {} })
  }, [routeLocation.state, routeLocation.pathname, navigate])

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== 'active') return false
      if (purpose === 'buy' && p.purpose && p.purpose !== 'sell') return false
      if (purpose === 'rent' && p.purpose !== 'rent') return false
      if (!propertyMatchesCategory(p, category)) return false
      if (!propertyMatchesLocation(p, location)) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [properties, category, location, search, purpose])

  const goToPost = () => {
    if (isGuest) {
      navigate('/login', { state: { from: '/post' } })
      return
    }
    navigate('/post')
  }

  const myListings = isAuthenticated ? properties.filter((p) => p.sellerId === user?.id && p.status === 'active') : []
  const totalViews = myListings.reduce((sum, p) => sum + (p.views || 0), 0)
  const locationLabel = browseLocationLabel(user)
  const areaLabel = location.label || t('allDistrict')

  return (
    <div className="relative min-h-full bg-white">
      <BackgroundDecor />

      <div className="relative lg:hidden px-5 pt-6 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
              {t('browseInArea').replace('{area}', areaLabel)}
            </p>
            <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight mt-1">
              <RotatingTagline />
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={goToPost}
              className="rounded-full border border-border-strong px-4 py-1.5 text-sm font-medium hover:bg-surface transition-colors"
            >
              + {t('post')}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <LocationPicker value={location} onChange={handleLocationChange} />
        </div>

        <div className="mt-3">
          <PurposeToggle
            value={purpose}
            onChange={setPurpose}
            onSell={goToPost}
            trailingAction={<WhatsAppContactButton variant="icon" />}
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
          {BROWSE_CATEGORIES.map((cat) => (
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
          {isAuthenticated && (
            <Import99AcresButton
              location={locationLabel}
              purpose={browsePurposeToListing(purpose)}
              onImported={() => fetchListings().then(setProperties)}
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-medium text-[15px]">{t('noProperties')}</p>
            <p className="text-muted text-sm mt-1.5 max-w-xs">{t('noPropertiesSub')}</p>
            {purpose === 'rent' && (
              <button
                type="button"
                onClick={() => setPurpose('buy')}
                className="mt-4 text-sm font-medium underline underline-offset-2"
              >
                {t('buy')}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-2">
            {filtered.map((p, i) => (
              <PropertyListItem
                key={p.id}
                property={p}
                showDivider={i < filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
              {isGuest ? t('guestBrowsing') : `${t('welcomeBack')}, ${user?.name}`}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">
              <RotatingTagline />
            </h1>
            <p className="text-sm text-muted mt-1">
              {t('browseInArea').replace('{area}', areaLabel)}
            </p>
          </div>
          <button
            type="button"
            onClick={goToPost}
            className="rounded-full border border-border-strong px-5 py-2 text-sm font-medium hover:bg-surface transition-colors"
          >
            + {t('postProperty')}
          </button>
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl border border-border p-5">
              <p className="text-muted text-sm">{t('activeListings')}</p>
              <p className="text-3xl font-bold mt-1 tabular-nums">{myListings.length}</p>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <p className="text-muted text-sm">{t('totalViews')}</p>
              <p className="text-3xl font-bold mt-1 tabular-nums">{totalViews}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">{t('guestPiiNotice')}</p>
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: '/browse' } })}
              className="mt-3 rounded-full bg-text px-5 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              {t('login')}
            </button>
          </div>
        )}

        <div className="mb-6 space-y-3">
          <LocationPicker value={location} onChange={handleLocationChange} />
          <PurposeToggle
            value={purpose}
            onChange={setPurpose}
            onSell={goToPost}
            trailingAction={<WhatsAppContactButton variant="icon" />}
          />
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
            {BROWSE_CATEGORIES.map((cat) => (
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
          {isAuthenticated && (
            <Import99AcresButton
              location={locationLabel}
              purpose={browsePurposeToListing(purpose)}
              onImported={() => fetchListings().then(setProperties)}
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-2xl">
            <p className="font-medium">{t('noProperties')}</p>
            <p className="text-muted text-sm mt-1">{t('noPropertiesSub')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <PropertyGridCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
