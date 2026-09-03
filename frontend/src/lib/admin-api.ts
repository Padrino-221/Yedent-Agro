import { API_BASE } from './api'
import type {
  Subsidiary,
  Product,
  Department,
  SalesRep,
  Award,
  Partner,
  HeroSlide,
  NewsEvent,
  SiteSettings,
} from './api'

export const TOKEN_KEY = 'yedent_admin_token'
export const USER_KEY = 'yedent_admin_user'

export interface AdminUser {
  id: string
  full_name: string
  email: string
  role: 'group_admin' | 'dept_admin'
  department_id?: string | null
  is_active?: boolean
  created_at?: string
}

export class AuthError extends Error {}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function storeAuth(token: string, user: AdminUser) {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    clearAuth()
    throw new AuthError('Session expired. Please log in again.')
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // no JSON body
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  const json = await res.json()
  return json.data as T
}

export async function login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const data = await apiFetch<{ token: string; user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  storeAuth(data.token, data.user)
  return data
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers, body: form })
  if (res.status === 401) {
    clearAuth()
    throw new AuthError('Session expired. Please log in again.')
  }
  if (!res.ok) {
    let message = 'Upload failed'
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  const json = await res.json()
  return json.data.url as string
}

export async function uploadVideo(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers, body: form })
  if (res.status === 401) {
    clearAuth()
    throw new AuthError('Session expired. Please log in again.')
  }
  if (!res.ok) {
    let message = 'Upload failed'
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  const json = await res.json()
  return json.data.url as string
}

// ---------- Generic CRUD helpers ----------

export function listAll<T>(resource: string, all = true): Promise<T[]> {
  return apiFetch<T[]>(`/${resource}${all ? '?all=true' : ''}`)
}

export function getOne<T>(resource: string, id: string): Promise<T> {
  return apiFetch<T>(`/${resource}/${id}`)
}

export function createItem<T>(resource: string, body: Record<string, unknown>): Promise<T> {
  return apiFetch<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) })
}

export function updateItem<T>(resource: string, id: string, body: Record<string, unknown>): Promise<T> {
  return apiFetch<T>(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export function deleteItem(resource: string, id: string): Promise<void> {
  return apiFetch<void>(`/${resource}/${id}`, { method: 'DELETE' })
}

// ---------- Typed resource helpers ----------

export const adminApi = {
  subsidiaries: {
    list: () => listAll<Subsidiary>('subsidiaries'),
    get: (id: string) => getOne<Subsidiary>('subsidiaries', id),
    create: (body: Record<string, unknown>) => createItem<Subsidiary>('subsidiaries', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<Subsidiary>('subsidiaries', id, body),
    remove: (id: string) => deleteItem('subsidiaries', id),
  },
  products: {
    list: () => listAll<Product>('products'),
    get: (id: string) => getOne<Product>('products', id),
    create: (body: Record<string, unknown>) => createItem<Product>('products', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<Product>('products', id, body),
    remove: (id: string) => deleteItem('products', id),
  },
  departments: {
    list: () => listAll<Department>('departments'),
    get: (id: string) => getOne<Department>('departments', id),
    create: (body: Record<string, unknown>) => createItem<Department>('departments', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<Department>('departments', id, body),
    remove: (id: string) => deleteItem('departments', id),
  },
  salesReps: {
    list: () => listAll<SalesRep>('sales-reps'),
    get: (id: string) => getOne<SalesRep>('sales-reps', id),
    create: (body: Record<string, unknown>) => createItem<SalesRep>('sales-reps', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<SalesRep>('sales-reps', id, body),
    remove: (id: string) => deleteItem('sales-reps', id),
  },
  awards: {
    list: () => listAll<Award>('awards'),
    get: (id: string) => getOne<Award>('awards', id),
    create: (body: Record<string, unknown>) => createItem<Award>('awards', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<Award>('awards', id, body),
    remove: (id: string) => deleteItem('awards', id),
  },
  partners: {
    list: () => listAll<Partner>('partners'),
    get: (id: string) => getOne<Partner>('partners', id),
    create: (body: Record<string, unknown>) => createItem<Partner>('partners', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<Partner>('partners', id, body),
    remove: (id: string) => deleteItem('partners', id),
  },
  heroSlides: {
    list: () => listAll<HeroSlide>('hero-slides'),
    get: (id: string) => getOne<HeroSlide>('hero-slides', id),
    create: (body: Record<string, unknown>) => createItem<HeroSlide>('hero-slides', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<HeroSlide>('hero-slides', id, body),
    remove: (id: string) => deleteItem('hero-slides', id),
  },
  news: {
    list: () => listAll<NewsEvent>('news'),
    get: (id: string) => getOne<NewsEvent>('news', id),
    create: (body: Record<string, unknown>) => createItem<NewsEvent>('news', body),
    update: (id: string, body: Record<string, unknown>) => updateItem<NewsEvent>('news', id, body),
    remove: (id: string) => deleteItem('news', id),
  },
  settings: {
    get: () => apiFetch<SiteSettings>('/settings'),
    save: (body: Record<string, string | null>) =>
      apiFetch<SiteSettings>('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  },
  users: {
    list: () => apiFetch<AdminUser[]>('/auth/users'),
    create: (body: Record<string, unknown>) => apiFetch<AdminUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    update: (id: string, body: Record<string, unknown>) =>
      apiFetch<AdminUser>(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) => apiFetch<void>(`/auth/users/${id}`, { method: 'DELETE' }),
  },
}