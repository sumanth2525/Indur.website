import { NavLink, useLocation } from 'react-router-dom'
import Icon from '../Icon'
import { useLanguage } from '../../i18n/LanguageContext'

const propertyMobileItems = [
  { to: '/browse', icon: 'home', labelKey: 'home', end: true },
  { to: '/browse', icon: 'search', labelKey: 'search', end: true, hash: '#search' },
  { to: '/post', icon: 'add_circle', labelKey: 'post' },
  { to: '/profile', icon: 'person', labelKey: 'profile', end: true },
]

const servicesMobileItems = [
  { to: '/services', icon: 'home', labelKey: 'home', end: true },
  { to: '/messages', icon: 'chat', labelKey: 'messages' },
  { to: '/profile', icon: 'person', labelKey: 'profile', end: true },
]

const desktopItems = [
  { to: '/browse', icon: 'dashboard', labelKey: 'dashboard', end: true },
  { to: '/services', icon: 'key', labelKey: 'localServices' },
  { to: '/messages', icon: 'chat', labelKey: 'messages' },
  { to: '/post', icon: 'add_circle', labelKey: 'postProperty' },
  { to: '/profile', icon: 'person', labelKey: 'profile' },
  { to: '/support', icon: 'help', labelKey: 'helpSupport' },
]

function MobileNavItem({ to, icon, labelKey, end, t, hash }) {
  if (hash) {
    return (
      <a href="/" className="flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium text-muted-light min-h-11 justify-center">
        <Icon name={icon} size={22} />
        <span>{t(labelKey)}</span>
      </a>
    )
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 py-1 px-6 text-[11px] font-medium transition-colors min-h-11 min-w-11 justify-center ${
          isActive ? 'text-text' : 'text-muted-light'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={icon} size={22} filled={isActive} />
          <span className={isActive ? 'font-semibold' : ''}>{t(labelKey)}</span>
        </>
      )}
    </NavLink>
  )
}

function DesktopNavItem({ to, icon, labelKey, end, t }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-text text-white'
            : 'text-muted hover:bg-surface hover:text-text'
        }`
      }
    >
      <Icon name={icon} size={20} />
      <span>{t(labelKey)}</span>
    </NavLink>
  )
}

export function BottomNav() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const mobileItems = pathname.startsWith('/services') ? servicesMobileItems : propertyMobileItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around py-2.5">
        {mobileItems.map((item) => (
          <MobileNavItem key={`${item.to}-${item.labelKey}`} {...item} t={t} />
        ))}
      </div>
    </nav>
  )
}

export function Sidebar() {
  const { t } = useLanguage()
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:border-border lg:bg-white lg:p-5">
      <div className="mb-10 px-2">
        <span className="font-bold tracking-tight text-sm">{t('appName')}</span>
      </div>
      <nav className="flex flex-col gap-1">
        {desktopItems.map((item) => (
          <DesktopNavItem key={item.to} {...item} t={t} />
        ))}
      </nav>
    </aside>
  )
}
