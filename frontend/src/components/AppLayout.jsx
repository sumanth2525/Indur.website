import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BottomNav, Sidebar } from './layout/Navigation'
import LanguageToggle from './LanguageToggle'

const FULL_BLEED_ROUTES = ['/', '/profile/saved', '/profile']

export default function AppLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const isChat = location.pathname.startsWith('/messages/')
  const isFullBleed = FULL_BLEED_ROUTES.some(
    (r) => location.pathname === r || (r !== '/' && location.pathname.startsWith(r)),
  )

  if (!user) return <Navigate to="/login" replace />

  const showMobileHeader = !isFullBleed && !isChat

  return (
    <div className="flex min-h-dvh bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {showMobileHeader && (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-5 py-3 lg:px-8">
            <span className="font-bold tracking-[0.08em] text-sm">NIZAMPROPERTY</span>
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
