import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getPropertyById, toggleSaved } from '../data/seed'
import PropertyCard from '../components/PropertyCard'

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
    <div className="px-4 lg:max-w-4xl lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button type="button" onClick={() => navigate(-1)} className="rounded-full p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{t('savedProperties')}</h1>
      </div>

      {saved.length === 0 ? (
        <p className="text-muted text-center py-12">{t('noProperties')}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {saved.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isSaved
              onToggleSave={handleToggleSave}
              layout="grid"
            />
          ))}
        </div>
      )}
    </div>
  )
}
