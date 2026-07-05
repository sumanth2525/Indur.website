import { useMemo, useState } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { AuthContext } from '../context/AuthContext'
import { LanguageProvider } from '../i18n/LanguageContext'
import { GUEST_USER } from '../context/guestUser'
import { authUser } from './mockData'

function buildAuthValue(overrides = {}) {
  return {
    user: authUser,
    loading: false,
    isGuest: false,
    isAuthenticated: true,
    loginWithGoogle: vi.fn().mockResolvedValue(authUser),
    loginWithPhone: vi.fn().mockResolvedValue(authUser),
    requestPhoneOtp: vi.fn().mockResolvedValue(undefined),
    continueAsGuest: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    setUser: vi.fn(),
    ...overrides,
  }
}

export function TestAuthProvider({ initialUser = authUser, children }) {
  const [user, setUser] = useState(initialUser)

  const value = useMemo(
    () => ({
      user,
      loading: false,
      isGuest: Boolean(user?.isGuest),
      isAuthenticated: Boolean(user && !user?.isGuest),
      loginWithGoogle: vi.fn(async () => {
        setUser(authUser)
        return authUser
      }),
      loginWithPhone: vi.fn(async () => {
        setUser(authUser)
        return authUser
      }),
      requestPhoneOtp: vi.fn().mockResolvedValue(undefined),
      continueAsGuest: vi.fn(() => setUser(GUEST_USER)),
      logout: vi.fn(() => setUser(null)),
      refreshUser: vi.fn(),
      setUser,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function renderApp({
  route = '/browse',
  initialIndex = 0,
  initialEntries,
  authUser: userOverride = authUser,
} = {}) {
  const entries = initialEntries ?? [route]

  return render(
    <MemoryRouter initialEntries={entries} initialIndex={initialIndex}>
      <TestAuthProvider initialUser={userOverride}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </TestAuthProvider>
    </MemoryRouter>,
  )
}

export { buildAuthValue }
