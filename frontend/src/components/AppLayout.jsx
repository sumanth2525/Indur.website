import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BottomNav, Sidebar } from './layout/Navigation'
import ScreenHeader from './ScreenHeader'

const CUSTOM_HEADER_PREFIXES = ['/messages/']

function usesCustomHeader(pathname) {
  return CUSTOM_HEADER_PREFIXES.some(
    (prefix) => pathname.startsWith(prefix) && pathname.length > prefix.length,
  )
}

export default function AppLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const isChat = usesCustomHeader(location.pathname)

  if (!user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-dvh bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {!isChat && <ScreenHeader />}

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
