import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BottomNav, Sidebar } from './layout/Navigation'
import LanguageToggle from './LanguageToggle'

export default function AppLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const isChat = location.pathname.startsWith('/messages/')

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:px-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">🏠</div>
            <span className="font-bold text-sm tracking-wide">NIZAMPROPERTY</span>
          </div>
          <div className="hidden lg:block" />
          <LanguageToggle />
        </header>

        <main className={`flex-1 ${isChat ? 'pb-0' : 'pb-20'} lg:pb-6 lg:px-8 lg:pt-6`}>
          <Outlet />
        </main>

        {!isChat && location.pathname !== '/post' && (
          <Link
            to="/post"
            className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg hover:bg-teal-dark transition-colors lg:bottom-8 lg:right-8"
            aria-label="Post Ad"
          >
            <Plus size={28} strokeWidth={2.5} />
          </Link>
        )}

        <BottomNav />
      </div>
    </div>
  )
}
