import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storage } from '../services/storage'
import MobileQrCard from '../components/MobileQrCard'

const menuItems = [
  { key: 'editProfile', path: '/profile/edit' },
  { key: 'myListings', path: '/profile/listings' },
  { key: 'savedProperties', path: '/profile/saved' },
  { key: 'notifications', path: '/profile/notifications' },
  { key: 'helpSupport', path: '/support' },
]

export default function Profile() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const properties = storage.getProperties()
  const myListings = properties.filter((p) => p.sellerId === user?.id)
  const activeCount = myListings.filter((p) => p.status === 'active').length
  const totalViews = myListings.reduce((s, p) => s + (p.views || 0), 0)

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="px-4 lg:px-0">
      <p className="text-xs text-muted tracking-widest pt-2">{t('yourAccount')}</p>
      <h1 className="text-2xl lg:text-3xl font-bold">{t('profile')}</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-8">
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center py-8 lg:py-0 lg:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal text-white text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <p className="font-bold text-lg mt-3">{user?.name}</p>
            <p className="text-muted text-sm">{t('buyerSeller')} — {user?.location || 'Nizamabad'}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8 lg:mb-0">
            <div className="rounded-2xl bg-surface border border-border p-4 text-center">
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-muted text-xs mt-0.5">{t('listings')}</p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-4 text-center">
              <p className="text-2xl font-bold">{user?.saved?.length || 0}</p>
              <p className="text-muted text-xs mt-0.5">{t('saved')}</p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-4 text-center">
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-muted text-xs mt-0.5">{t('views')}</p>
            </div>
          </div>

          <MobileQrCard />
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs text-muted tracking-widest mb-2">{t('account')}</p>
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            {menuItems.map((item, i) => (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center justify-between px-4 py-4 hover:bg-surface transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="text-sm font-medium">{t(item.key)}</span>
                <ChevronRight size={18} className="text-muted" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 w-full rounded-full border border-text py-3.5 font-medium hover:bg-surface transition-colors lg:max-w-xs"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </div>
  )
}
