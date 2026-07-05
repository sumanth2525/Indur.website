import Icon from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import useGoBack from '../hooks/useGoBack'

export default function BackButton({
  fallback,
  className = '',
  showLabel = false,
  iconSize = 22,
  onClick,
}) {
  const { t } = useLanguage()
  const goBack = useGoBack(fallback)

  return (
    <button
      type="button"
      onClick={onClick ?? goBack}
      className={`inline-flex items-center gap-1 rounded-full p-2 text-text transition-colors hover:bg-surface ${className}`}
      aria-label={t('back')}
    >
      <Icon name="arrow_back" size={iconSize} />
      {showLabel && <span className="text-sm font-medium">{t('back')}</span>}
    </button>
  )
}
