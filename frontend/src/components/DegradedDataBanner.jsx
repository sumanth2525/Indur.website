import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'

export default function DegradedDataBanner({ onRetry }) {
  const { t } = useLanguage()

  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Icon name="cloud_off" size={20} className="shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{t('offlineDataTitle')}</p>
        <p className="mt-0.5 text-xs text-amber-800">{t('offlineDataSub')}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full border border-amber-300 px-3 py-1 text-xs font-medium hover:bg-amber-100"
        >
          {t('retry')}
        </button>
      )}
    </div>
  )
}
