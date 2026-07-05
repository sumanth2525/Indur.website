import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import LocationPicker from '../components/LocationPicker'
import ServiceListItem from '../components/ServiceListItem'
import ServiceListItemSkeleton from '../components/ServiceListItemSkeleton'
import DegradedDataBanner from '../components/DegradedDataBanner'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import useBrowseLocation from '../hooks/useBrowseLocation'
import { fetchServiceCategories } from '../services/dataApi'
import { LOCAL_SERVICES } from '../data/localServices'
import { getStaticProvidersForService } from '../data/serviceProviders'
import { providerMatchesLocation, sortProvidersByLocation } from '../utils/serviceLocation'

function useDebouncedValue(value, delayMs = 200) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

function getPrimaryProviderMeta(serviceId, browseLocation, t) {
  const providers = sortProvidersByLocation(getStaticProvidersForService(serviceId), browseLocation)
  const primary = providers.find((p) => providerMatchesLocation(p, browseLocation)) || providers[0]
  if (!primary) return null
  return {
    rating: primary.reviewCount > 0 ? primary.rating : null,
    availableNow: primary.availableNow,
    availableLabel: t('availableNow'),
  }
}

export default function LocalServices() {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const { location, handleLocationChange } = useBrowseLocation(user, setUser)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const [services, setServices] = useState(LOCAL_SERVICES)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const categories = await fetchServiceCategories()
      if (categories.length > 0) {
        setServices(categories)
        setUsingFallback(false)
      } else {
        setServices(LOCAL_SERVICES)
        setUsingFallback(true)
      }
    } catch {
      setServices(LOCAL_SERVICES)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const filteredServices = useMemo(() => {
    let list = services

    if (location && location.scope !== 'district') {
      list = list.filter((service) => {
        const providers = getStaticProvidersForService(service.id)
        return providers.some((provider) => providerMatchesLocation(provider, location))
      })
    }

    if (!debouncedSearch.trim()) return list
    const q = debouncedSearch.trim().toLowerCase()
    return list.filter((service) => {
      const title = t(service.titleKey).toLowerCase()
      const subtitle = t(service.subtitleKey).toLowerCase()
      return title.includes(q) || subtitle.includes(q)
    })
  }, [debouncedSearch, services, location, t])

  return (
    <div className="relative min-h-full bg-white">
      <div className="relative px-5 pt-6 pb-28 lg:pb-8">
        <div className="flex items-center justify-between gap-3">
          <LocationPicker value={location} onChange={handleLocationChange} />
          <button
            type="button"
            onClick={() => navigate('/profile/notifications')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white transition-colors hover:bg-surface"
            aria-label={t('notifications')}
          >
            <Icon name="notifications" size={22} className="text-muted" />
          </button>
        </div>

        <p className="mt-6 text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
          {t('aroundYou')}
        </p>
        <h1 className="mt-1 text-[1.65rem] font-bold leading-tight tracking-tight text-text">
          {t('localServices')}
        </h1>

        <div className="relative mt-5">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchServices')}
            className="w-full rounded-full bg-surface py-3.5 pl-11 pr-4 text-sm text-text outline-none placeholder:text-muted focus:ring-2 focus:ring-teal/20"
          />
        </div>

        {usingFallback && !loading && (
          <div className="mt-4">
            <DegradedDataBanner onRetry={loadCategories} />
          </div>
        )}

        <div className="mt-5 space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ServiceListItemSkeleton key={i} />)
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-border px-4 py-10 text-center">
              <p className="text-sm font-medium text-text">{t('noServicesFound')}</p>
              <p className="mt-1 text-sm text-muted">{t('noServicesFoundSub')}</p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const meta = getPrimaryProviderMeta(service.id, location, t)
              return (
                <ServiceListItem
                  key={service.id}
                  title={t(service.titleKey)}
                  subtitle={t(service.subtitleKey)}
                  icon={service.icon}
                  serviceId={service.id}
                  color={service.color}
                  meta={meta}
                  availableNow={meta?.availableNow}
                  onClick={() => navigate(`/services/${service.id}`)}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
