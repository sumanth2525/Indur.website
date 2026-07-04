import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { LOCATIONS } from '../i18n/translations'

export default function LocationPicker({ value, onChange, className = '' }) {
  const { t } = useLanguage()

  return (
    <div className={`relative inline-flex max-w-full ${className}`}>
      <Icon
        name="location_on"
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal pointer-events-none z-10"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('selectLocation')}
        className="appearance-none rounded-full border border-border-strong bg-white pl-10 pr-9 py-2.5 text-sm font-medium text-text outline-none focus:border-teal cursor-pointer max-w-full truncate"
      >
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <Icon
        name="expand_more"
        size={20}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
    </div>
  )
}
