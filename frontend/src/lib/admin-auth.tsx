'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser, storeAuth, clearAuth, login as apiLogin, type AdminUser } from './admin-api'

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isGroupAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin(email, password)
      storeAuth(data.token, data.user)
      setUser(data.user)
      router.replace('/admin/dashboard')
    },
    [router]
  )

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    router.replace('/admin/login')
  }, [router])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isGroupAdmin: user?.role === 'group_admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}