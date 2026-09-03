'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#f3f1ec] flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
    </div>
  )
}