import { NavLink } from 'react-router-dom'
import { Home, MessageCircle, User, LayoutDashboard, PlusCircle, HelpCircle } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

const navItems = [
  { to: '/', icon: Home, labelKey: 'home', end: true },
  { to: '/messages', icon: MessageCircle, labelKey: 'messages' },
  { to: '/profile', icon: User, labelKey: 'profile' },
]

const desktopItems = [
  { to: '/', icon: LayoutDashboard, labelKey: 'dashboard', end: true },
  { to: '/messages', icon: MessageCircle, labelKey: 'messages' },
  { to: '/post', icon: PlusCircle, labelKey: 'postProperty' },
  { to: '/profile', icon: User, labelKey: 'profile' },
  { to: '/support', icon: HelpCircle, labelKey: 'helpSupport' },
]

function NavItem({ to, icon: Icon, labelKey, end, t, mobile }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        mobile
          ? `flex flex-col items-center gap-0.5 py-1 px-4 text-xs font-medium transition-colors ${
              isActive ? 'text-teal' : 'text-muted'
            }`
          : `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-teal text-white'
                : 'text-muted hover:bg-teal-light hover:text-teal'
            }`
      }
    >
      <Icon size={mobile ? 22 : 20} />
      <span>{t(labelKey)}</span>
    </NavLink>
  )
}

export function BottomNav() {
  const { t } = useLanguage()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} t={t} mobile />
        ))}
      </div>
    </nav>
  )
}

export function Sidebar() {
  const { t } = useLanguage()
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:border-border lg:bg-white lg:p-4">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-white text-lg">🏠</div>
          <span className="font-bold tracking-wide text-sm">{t('appName')}</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {desktopItems.map((item) => (
          <NavItem key={item.to} {...item} t={t} mobile={false} />
        ))}
      </nav>
    </aside>
  )
}
