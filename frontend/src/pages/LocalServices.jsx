import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import LocationPicker from '../components/LocationPicker'
import ServiceListItem from '../components/ServiceListItem'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { resolveBrowseLocation } from '../services/formatters'
import { patchProfile, fetchServiceCategories } from '../services/dataApi'
import { LOCAL_SERVICES } from '../data/localServices'

export default function LocalServices() {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(() => resolveBrowseLocation(user))
  const [search, setSearch] = useState('')
  const [services, setServices] = useState(LOCAL_SERVICES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLocation(resolveBrowseLocation(user))
  }, [user?.browseLocation, user?.location])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const categories = await fetchServiceCategories()
        if (!cancelled && categories.length > 0) {
          setServices(categories)
        }
      } catch {
        if (!cancelled) setServices(LOCAL_SERVICES)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services
    const q = search.trim().toLowerCase()
    return services.filter((service) => {
      const title = t(service.titleKey).toLowerCase()
      const subtitle = t(service.subtitleKey).toLowerCase()
      return title.includes(q) || subtitle.includes(q)
    })
  }, [search, services, t])

  const handleLocationChange = async (loc) => {
    setLocation(loc)
    if (!user?.id) return
    const updated = await patchProfile(user.id, {
      browseLocation: loc,
      location: loc.label,
    })
    if (updated) setUser(updated)
  }

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

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-border px-4 py-10 text-center">
              <p className="text-sm text-muted">{t('loading')}</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-border px-4 py-10 text-center">
              <p className="text-sm font-medium text-text">{t('noServicesFound')}</p>
              <p className="mt-1 text-sm text-muted">{t('noServicesFoundSub')}</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <ServiceListItem
                key={service.id}
                title={t(service.titleKey)}
                subtitle={t(service.subtitleKey)}
                color={service.color}
                onClick={() => navigate(`/services/${service.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
