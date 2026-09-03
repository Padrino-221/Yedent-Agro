'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/admin-auth'
import { Dropdown } from './dropdown'
import {
  PiLayoutDuotone,
  PiPackageDuotone,
  PiSquaresFourDuotone,
  PiUsersDuotone,
  PiMapPinDuotone,
  PiTrophyDuotone,
  PiImagesDuotone,
  PiNewspaperDuotone,
  PiHandshakeDuotone,
  PiGearDuotone,
  PiSignOutDuotone,
  PiArrowSquareOutDuotone,
  PiListDuotone,
  PiXDuotone,
  PiShieldCheckDuotone,
  PiCaretDownDuotone,
} from 'react-icons/pi'

const nav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: PiLayoutDuotone },
  { name: 'Products', href: '/admin/products', icon: PiPackageDuotone },
  { name: 'Subsidiaries', href: '/admin/subsidiaries', icon: PiSquaresFourDuotone },
  { name: 'Departments', href: '/admin/departments', icon: PiShieldCheckDuotone },
  { name: 'Sales Reps', href: '/admin/sales-reps', icon: PiMapPinDuotone },
  { name: 'Awards', href: '/admin/awards', icon: PiTrophyDuotone },
  { name: 'Hero Slides', href: '/admin/hero-slides', icon: PiImagesDuotone },
  { name: 'Partners', href: '/admin/partners', icon: PiHandshakeDuotone },
  { name: 'News & Events', href: '/admin/news', icon: PiNewspaperDuotone },
  { name: 'Site Settings', href: '/admin/settings', icon: PiGearDuotone },
  { name: 'Users', href: '/admin/users', icon: PiUsersDuotone, groupAdminOnly: true },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isGroupAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
      </div>
    )
  }

  const initials = (user.full_name || user.email)
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <div className="w-9 h-9 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src="/yedent-logo.png"
              alt="Yedent Agro Group Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none uppercase tracking-wide">Yedent CMS</p>
            <p className="text-white/50 text-[11px] mt-1">Content Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav
          .filter((item) => !item.groupAdminOnly || isGroupAdmin)
          .map((item) => {
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium ${
                  active ? 'bg-lime text-dark font-semibold' : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            )
          })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <Dropdown
          align="left"
          label="User menu"
          trigger={
            <span className="w-full flex items-center gap-3 px-1.5 py-2 rounded hover:bg-white/10">
              <span className="w-9 h-9 rounded-full bg-lime flex items-center justify-center text-dark font-bold text-xs shrink-0">
                {initials}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-white text-sm font-semibold truncate">{user.full_name}</span>
                <span className="block text-white/50 text-xs capitalize">{user.role.replace('_', ' ')}</span>
              </span>
              <PiCaretDownDuotone className="w-4 h-4 text-white/40 shrink-0" />
            </span>
          }
          items={[
            {
              label: 'View live site',
              icon: <PiArrowSquareOutDuotone className="w-4 h-4" />,
              onClick: () => window.open('/', '_blank'),
            },
            { divider: true },
            {
              label: 'Sign out',
              icon: <PiSignOutDuotone className="w-4 h-4" />,
              danger: true,
              onClick: logout,
            },
          ]}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-dark z-40">{sidebar}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-dark">{sidebar}</aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Mobile topbar */}
        <div className="lg:hidden sticky top-0 z-30 bg-dark text-white px-4 py-3 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-bold uppercase tracking-wide text-sm">
            Yedent CMS
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5" aria-label="Toggle menu">
            {sidebarOpen ? <PiXDuotone className="w-5 h-5" /> : <PiListDuotone className="w-5 h-5" />}
          </button>
        </div>

        <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  )
}