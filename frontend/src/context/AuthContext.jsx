import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from '../services/storage'
import { createUser, getUserById } from '../data/seed'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getCurrentUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      const fresh = getUserById(user.id)
      if (fresh) setUser(fresh)
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    let existing = storage.getUsers().find((u) => u.authProvider === 'google')
    if (!existing) {
      existing = createUser({
        name: 'Ravi Kumar',
        email: 'ravi@gmail.com',
        phone: '+91 98765 43210',
        authProvider: 'google',
      })
    }
    storage.setCurrentUser(existing)
    setUser(existing)
    setLoading(false)
    return existing
  }, [])

  const loginWithPhone = useCallback(async (phone, otp) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    if (otp !== '123456') {
      setLoading(false)
      throw new Error('Invalid OTP')
    }
    let existing = storage.getUsers().find((u) => u.phone === phone)
    if (!existing) {
      existing = createUser({
        name: 'New User',
        phone,
        authProvider: 'phone',
      })
    }
    storage.setCurrentUser(existing)
    setUser(existing)
    setLoading(false)
    return existing
  }, [])

  const logout = useCallback(() => {
    storage.clearCurrentUser()
    setUser(null)
  }, [])

  const refreshUser = useCallback(() => {
    if (user?.id) {
      const fresh = getUserById(user.id)
      if (fresh) {
        storage.setCurrentUser(fresh)
        setUser(fresh)
      }
    }
  }, [user?.id])

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithPhone, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
