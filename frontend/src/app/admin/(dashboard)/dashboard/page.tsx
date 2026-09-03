'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { adminApi, AuthError, type AdminUser } from '@/lib/admin-api'
import { useAuth } from '@/lib/admin-auth'
import { PageHeader, Loading, ErrorState } from '@/components/admin/ui'
import {
  PiPackageDuotone,
  PiSquaresFourDuotone,
  PiShieldCheckDuotone,
  PiMapPinDuotone,
  PiTrophyDuotone,
  PiImagesDuotone,
  PiNewspaperDuotone,
  PiPlusDuotone,
  PiArrowSquareOutDuotone,
} from 'react-icons/pi'

interface Counts {
  products: number
  productsPublished: number
  subsidiaries: number
  departments: number
  salesReps: number
  awards: number
  heroSlides: number
  news: number
  users: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isGroupAdmin } = useAuth()
  const [counts, setCounts] = useState<Counts | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [products, subsidiaries, departments, salesReps, awards, heroSlides, news] = await Promise.all([
        adminApi.products.list(),
        adminApi.subsidiaries.list(),
        adminApi.departments.list(),
        adminApi.salesReps.list(),
        adminApi.awards.list(),
        adminApi.heroSlides.list(),
        adminApi.news.list(),
      ])
      let users: AdminUser[] = []
      if (isGroupAdmin) {
        users = await adminApi.users.list().catch(() => [])
      }
      setCounts({
        products: products.length,
        productsPublished: products.filter((p) => p.is_published).length,
        subsidiaries: subsidiaries.length,
        departments: departments.length,
        salesReps: salesReps.length,
        awards: awards.length,
        heroSlides: heroSlides.length,
        news: news.length,
        users: users.length,
      })
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    }
  }, [router, isGroupAdmin])

  useEffect(() => {
    load()
  }, [load])

  const cards = [
    { label: 'Products', value: counts?.products, sub: `${counts?.productsPublished ?? 0} published`, href: '/admin/products', icon: PiPackageDuotone },
    { label: 'Subsidiaries', value: counts?.subsidiaries, href: '/admin/subsidiaries', icon: PiSquaresFourDuotone },
    { label: 'Departments', value: counts?.departments, href: '/admin/departments', icon: PiShieldCheckDuotone },
    { label: 'Sales Reps', value: counts?.salesReps, href: '/admin/sales-reps', icon: PiMapPinDuotone },
    { label: 'Awards', value: counts?.awards, href: '/admin/awards', icon: PiTrophyDuotone },
    { label: 'Hero Slides', value: counts?.heroSlides, href: '/admin/hero-slides', icon: PiImagesDuotone },
    { label: 'News & Events', value: counts?.news, href: '/admin/news', icon: PiNewspaperDuotone },
    ...(isGroupAdmin ? [{ label: 'Admin Users', value: counts?.users, href: '/admin/users', icon: PiShieldCheckDuotone }] : []),
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] ?? 'Admin'}`}
        description="Manage all the content that powers the Yedent Agro website."
        actions={
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-dark/25 text-dark rounded hover:bg-dark hover:text-white">
            <PiArrowSquareOutDuotone className="w-4 h-4" /> View live site
          </Link>
        }
      />

      {error && !counts && <ErrorState message={error} onRetry={load} />}
      {!counts && !error && <Loading />}

      {counts && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {cards.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="bg-white border border-dark/10 rounded-lg p-5 hover:border-dark/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-dark/45 text-xs font-semibold uppercase tracking-wide">{c.label}</span>
                  <c.icon className="w-5 h-5 text-lime-700" />
                </div>
                <p className="text-3xl font-bold text-dark leading-none">{c.value ?? '–'}</p>
                {c.sub && <p className="text-xs text-dark/45 mt-1.5">{c.sub}</p>}
              </Link>
            ))}
          </div>

          <div className="bg-white border border-dark/10 rounded-lg p-6">
            <h2 className="text-lg font-bold text-dark mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Add a product', href: '/admin/products/new' },
                { label: 'Add a news story', href: '/admin/news/new' },
                { label: 'Add a hero slide', href: '/admin/hero-slides/new' },
                { label: 'Update site settings', href: '/admin/settings' },
                { label: 'Add a sales rep', href: '/admin/sales-reps/new' },
                { label: 'Add an award', href: '/admin/awards/new' },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="inline-flex items-center justify-between gap-2 px-4 py-3 rounded border border-dark/15 text-sm font-semibold text-dark hover:border-lime-700 hover:bg-lime-50"
                >
                  {a.label}
                  <PiPlusDuotone className="w-4 h-4 text-lime-700" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}