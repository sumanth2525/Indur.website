import { useLanguage } from '../i18n/LanguageContext'
import WhatsAppIcon from './icons/WhatsAppIcon'
import { getWhatsAppContactUrl } from '../config/contact'

const ICON_CLASS =
  'flex items-center justify-center rounded-full border border-border-strong bg-white text-text transition-colors hover:bg-surface hover:border-text'

export default function WhatsAppContactButton({ className = '', style, variant = 'full' }) {
  const { t } = useLanguage()
  const url = getWhatsAppContactUrl(t('contactWhatsAppMessage'))

  if (!url) return null

  if (variant === 'icon') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('contactWhatsApp')}
        title={t('contactWhatsApp')}
        className={`${ICON_CLASS} h-11 w-11 shrink-0 ${className}`}
        style={style}
      >
        <WhatsAppIcon size={20} />
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ICON_CLASS} w-full gap-2.5 py-3.5 px-6 text-sm font-medium lg:py-4 ${className}`}
      style={style}
    >
      <WhatsAppIcon />
      {t('contactWhatsApp')}
    </a>
  )
}
