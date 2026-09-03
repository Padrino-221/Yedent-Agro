'use client'

import { useEffect, useState } from 'react'
import { getSettings, type SiteSettings } from './api'

export function useSettings(initialSettings?: SiteSettings | null) {
  const [settings, setSettings] = useState<SiteSettings | null>(
    initialSettings ?? null
  )
  const [loading, setLoading] = useState(!initialSettings)

  useEffect(() => {
    if (initialSettings) return
    let active = true
    getSettings()
      .then((s) => {
        if (active) {
          setSettings(s)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [initialSettings])

  return { settings, loading }
}
