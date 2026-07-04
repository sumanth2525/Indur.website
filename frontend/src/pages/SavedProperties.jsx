import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getPropertyById, toggleSaved } from '../data/seed'
import PropertyListItem from '../components/PropertyListItem'
import BackgroundDecor from '../components/BackgroundDecor'

export default function SavedProperties() {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const saved = (user?.saved || []).map(getPropertyById).filter(Boolean)

  const handleToggleSave = (propertyId) => {
    toggleSaved(user.id, propertyId)
    refreshUser()
  }

  return (
    <div className="relative min-h-full bg-white lg:max-w-3xl lg:mx-auto">
      <BackgroundDecor />

      <div className="relative px-5 pt-6 lg:px-0 lg:pt-0">
        <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase">
          {t('saved')}
        </p>
        <h1 className="text-[2rem] font-bold leading-tight tracking-tight mt-1">{t('savedProperties')}</h1>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-medium text-[15px]">{t('noProperties')}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 rounded-full border border-border-strong px-5 py-2 text-sm font-medium hover:bg-surface"
            >
              {t('properties')}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {saved.map((p, i) => (
              <PropertyListItem
                key={p.id}
                property={p}
                isSaved
                onToggleSave={handleToggleSave}
                showDivider={i < saved.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
