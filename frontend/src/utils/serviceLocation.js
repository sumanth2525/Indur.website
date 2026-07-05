export function providerMatchesLocation(provider, browseLocation) {
  if (!browseLocation || browseLocation.scope === 'district') return true
  const areas = provider.areas || []
  if (areas.length === 0) return true

  const label = (browseLocation.label || '').toLowerCase()
  const division = (browseLocation.division || '').toLowerCase()
  const mandal = (browseLocation.mandal || '').toLowerCase()

  return areas.some((area) => {
    const normalized = String(area).toLowerCase()
    return (
      label.includes(normalized)
      || division.includes(normalized)
      || mandal.includes(normalized)
      || normalized.includes(label)
    )
  })
}

export function sortProvidersByLocation(providers, browseLocation) {
  if (!browseLocation) return providers
  return [...providers].sort((a, b) => {
    const aMatch = providerMatchesLocation(a, browseLocation) ? 0 : 1
    const bMatch = providerMatchesLocation(b, browseLocation) ? 0 : 1
    return aMatch - bMatch || (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  })
}
