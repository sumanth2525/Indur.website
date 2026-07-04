import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Notifications() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="px-4 lg:max-w-lg lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button type="button" onClick={() => navigate(-1)} className="rounded-full p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{t('notifications')}</h1>
      </div>
      <div className="flex flex-col items-center py-20 text-center">
        <Bell size={48} className="text-muted mb-4" />
        <p className="text-muted text-sm">No notifications yet</p>
      </div>
    </div>
  )
}
