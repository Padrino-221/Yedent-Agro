'use client'

import { AuthProvider } from '@/lib/admin-auth'
import { ToastProvider } from '@/lib/toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}