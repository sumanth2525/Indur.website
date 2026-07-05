import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { fetchSellerListings } from '../services/dataApi'
import ShareAppCard from '../components/ShareAppCard'

const menuItems = [
  { key: 'editProfile', path: '/profile/edit' },
  { key: 'myListings', path: '/profile/listings' },
  { key: 'notifications', path: '/profile/notifications' },
  { key: 'helpSupport', path: '/support' },
]

export default function Profile() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [myListings, setMyListings] = useState([])

  useEffect(() => {
    if (!user?.id) return
    fetchSellerListings(user.id).then(setMyListings)
  }, [user?.id])

  const activeCount = myListings.filter((p) => p.status === 'active').length
  const totalViews = myListings.reduce((s, p) => s + (p.views || 0), 0)

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="px-5 lg:px-0">
      <p className="text-[11px] font-medium tracking-[0.12em] text-muted-light uppercase pt-2 lg:pt-0">{t('yourAccount')}</p>
      <h1 className="text-[2rem] lg:text-3xl font-bold tracking-tight mt-1">{t('profile')}</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-8">
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center py-8 lg:py-0 lg:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-text text-white text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <p className="font-bold text-lg mt-3">{user?.name}</p>
            <p className="text-muted text-sm">{t('buyerSeller')} — {user?.location || 'Nizamabad'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8 lg:mb-0">
            <div className="rounded-2xl bg-surface border border-border p-4 text-center">
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-muted text-xs mt-0.5">{t('listings')}</p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-4 text-center">
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-muted text-xs mt-0.5">{t('views')}</p>
            </div>
          </div>

          <ShareAppCard />
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
                <Icon name="chevron_right" size={18} className="text-muted" />
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
