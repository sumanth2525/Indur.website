import { useState } from 'react'
import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { importFrom99Acres } from '../services/apifyImport'

export default function Import99AcresButton({ location, purpose, onImported }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const apiEnabled = Boolean(import.meta.env.VITE_API_URL) || import.meta.env.DEV
  if (!apiEnabled) return null

  const handleImport = async () => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const result = await importFrom99Acres({ location, purpose, limit: 25 })
      setMessage(t('importSuccess').replace('{n}', String(result.imported)))
      onImported?.()
    } catch (e) {
      setError(e.message || t('importFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-border-strong bg-surface/50 p-4">
      <div className="flex items-start gap-3">
        <Icon name="cloud_download" size={22} className="text-teal shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{t('import99acres')}</p>
          <p className="text-xs text-muted mt-1 leading-relaxed">{t('import99acresSub')}</p>
          {message && <p className="text-xs text-teal mt-2">{message}</p>}
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="mt-3 rounded-full border border-border-strong bg-white px-4 py-2 text-xs font-medium hover:bg-white/80 disabled:opacity-50"
          >
            {loading ? t('importing') : t('importListings')}
          </button>
        </div>
      </div>
    </div>
  )
}
