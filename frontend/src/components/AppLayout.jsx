import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { BottomNav, Sidebar } from './layout/Navigation'
import LanguageToggle from './LanguageToggle'
import Icon from './Icon'

const FULL_BLEED_ROUTES = ['/browse', '/services', '/profile/saved', '/profile']

export default function AppLayout() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()
  const isChat = location.pathname.startsWith('/messages/')
  const isFullBleed = FULL_BLEED_ROUTES.some(
    (r) => location.pathname === r || (r !== '/' && location.pathname.startsWith(r)),
  )

  if (!user) return <Navigate to="/" replace />

  const showMobileHeader = !isFullBleed && !isChat

  return (
    <div className="flex min-h-dvh bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {showMobileHeader && (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-5 py-3 lg:px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-text text-white">
                <Icon name="home" size={20} filled />
              </div>
              <span className="font-bold tracking-tight text-sm">{t('appName')}</span>
            </div>
            <LanguageToggle />
          </header>
        )}

        <main
          className={`flex-1 bg-white ${
            isChat ? 'pb-0' : 'pb-[calc(4.5rem+env(safe-area-inset-bottom))]'
          } lg:pb-8 lg:px-8 lg:pt-8`}
        >
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
