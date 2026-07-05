import { useState, useMemo, useRef, useEffect } from 'react'
import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import {
  REVENUE_DIVISIONS,
  DEFAULT_LOCATION,
  normalizeLocation,
  mandalLocation,
  villageLocation,
  divisionLocation,
  searchLocations,
} from '../data/nizamabadLocations'
import { detectUserLocation } from '../services/geolocation'

export default function LocationPicker({ value, onChange, className = '' }) {
  const { t } = useLanguage()
  const loc = normalizeLocation(value)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [detecting, setDetecting] = useState(false)
  const panelRef = useRef(null)

  const searchResults = useMemo(() => (query.length >= 2 ? searchLocations(query) : []), [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const select = (next) => {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  const handleDetect = async () => {
    setDetecting(true)
    try {
      const detected = await detectUserLocation()
      select(detected)
    } catch {
      /* ignore */
    } finally {
      setDetecting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full border border-border-strong bg-white pl-3.5 pr-3 py-2.5 text-sm font-medium text-text hover:bg-surface transition-colors max-w-full ${className}`}
        aria-label={t('selectLocation')}
      >
        <Icon name="location_on" size={18} className="text-[#137A63] shrink-0" />
        <span className="truncate">{loc.label}</span>
        <Icon name="expand_more" size={20} className="text-muted shrink-0" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t('back')}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="relative w-full max-w-lg max-h-[85dvh] lg:max-h-[80vh] bg-white rounded-t-2xl lg:rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-base">{t('selectLocation')}</h2>
              <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-surface">
                <Icon name="close" size={22} />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-border space-y-2">
              <div className="relative">
                <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchMandalVillage')}
                  className="w-full rounded-xl border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleDetect}
                disabled={detecting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal/30 bg-teal-light py-2.5 text-sm font-medium text-teal hover:bg-teal-light/80 disabled:opacity-50"
              >
                <Icon name="my_location" size={18} />
                {detecting ? t('detectingLocation') : t('useMyLocation')}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
              {searchResults.length > 0 ? (
                <ul className="space-y-0.5">
                  {searchResults.map((item) => (
                    <li key={`${item.mandal}-${item.village || 'm'}-${item.label}`}>
                      <button
                        type="button"
                        onClick={() => select(item)}
                        className="w-full text-left rounded-xl px-3 py-2.5 hover:bg-surface text-sm"
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className="block text-xs text-muted mt-0.5">{item.division} · {t('division')}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => select({ ...DEFAULT_LOCATION })}
                    className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface ${
                      loc.scope === 'district' ? 'bg-surface' : ''
                    }`}
                  >
                    {t('allDistrict')} — {DEFAULT_LOCATION.label}
                  </button>

                  <div className="mt-3 flex flex-wrap gap-2 px-1">
                    {REVENUE_DIVISIONS.map((div) => (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => select(divisionLocation(div.id))}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          loc.scope === 'division' && loc.division === div.name
                            ? 'border-teal bg-teal-light text-teal'
                            : 'border-border hover:border-teal/40 hover:bg-surface'
                        }`}
                      >
                        {div.name}
                      </button>
                    ))}
                  </div>

                  {REVENUE_DIVISIONS.map((div) => (
                    <div key={div.id} className="mt-3">
                      <p className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        {t('division')}: {div.name}
                      </p>
                      {div.mandals.map((mandal) => (
                        <div key={mandal.name} className="mb-1">
                          <button
                            type="button"
                            onClick={() => select(mandalLocation(mandal.name))}
                            className={`w-full text-left rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface ${
                              loc.mandal === mandal.name && !loc.village ? 'bg-surface' : ''
                            }`}
                          >
                            {mandal.name}
                            <span className="text-xs text-muted font-normal ml-2">
                              ({mandal.villages.length} {t('villages')})
                            </span>
                          </button>
                          {loc.mandal === mandal.name && (
                            <ul className="ml-3 border-l border-border pl-2 mb-2">
                              {mandal.villages.slice(0, 8).map((v) => (
                                <li key={v}>
                                  <button
                                    type="button"
                                    onClick={() => select(villageLocation(mandal.name, v))}
                                    className="w-full text-left rounded-lg px-2 py-1.5 text-xs text-muted hover:bg-surface hover:text-text"
                                  >
                                    {v}
                                  </button>
                                </li>
                              ))}
                              {mandal.villages.length > 8 && (
                                <li className="px-2 py-1 text-xs text-muted italic">
                                  {t('searchForMoreVillages')}
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
