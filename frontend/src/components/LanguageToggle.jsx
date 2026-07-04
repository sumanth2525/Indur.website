import { Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { t, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-surface transition-colors ${className}`}
      aria-label="Toggle language"
    >
      <Languages size={16} className="text-teal" />
      {t('language')}
    </button>
  )
}
