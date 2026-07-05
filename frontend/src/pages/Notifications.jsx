import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'

export default function Notifications() {
  const { t } = useLanguage()

  return (
    <div className="px-4 lg:max-w-lg lg:mx-auto lg:px-0">
      <div className="mb-6 pt-2">
        <h1 className="text-xl font-bold">{t('notifications')}</h1>
      </div>
      <div className="flex flex-col items-center py-20 text-center">
        <Icon name="notifications" size={48} className="text-muted mb-4" />
        <p className="text-muted text-sm">{t('noNotifications')}</p>
      </div>
    </div>
  )
}
