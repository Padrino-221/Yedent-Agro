import type { SiteSettings } from './api'

export function settingValue(settings: SiteSettings | null | undefined, key: string, fallback: string): string {
  const value = settings?.[key]
  return value && value.length ? value : fallback
}

/** Parse a JSON array of rows stored under `key`, returning `fallback` when missing/invalid. */
export function settingRow<T extends Record<string, string>>(
  settings: SiteSettings | null | undefined,
  key: string,
  fallback: T[]
): T[] {
  const raw = settings?.[key]
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch {
    return fallback
  }
}
