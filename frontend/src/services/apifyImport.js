import { storage } from './storage'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function getImportStatus() {
  const res = await fetch(`${API_BASE}/api/import/99acres/status`)
  if (!res.ok) throw new Error('Import service unavailable')
  return res.json()
}

export async function importFrom99Acres({ location = 'Nizamabad', purpose = 'sell', limit = 30 } = {}) {
  const res = await fetch(`${API_BASE}/api/import/99acres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, purpose, limit }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.hint || 'Import failed')

  if (data.properties?.length) {
    mergeImportedProperties(data.properties)
  }

  return data
}

export function mergeImportedProperties(imported) {
  const existing = storage.getProperties()
  const byId = new Map(existing.map((p) => [p.id, p]))
  for (const p of imported) {
    byId.set(p.id, {
      ...p,
      location: p.location || { area: 'Nizamabad', city: 'Nizamabad' },
      images: p.images?.length ? p.images : [],
    })
  }
  storage.saveProperties([...byId.values()])
}
