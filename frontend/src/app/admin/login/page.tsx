'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/admin-auth'
import { PiLockKeyDuotone, PiEnvelopeDuotone, PiCaretLeftDuotone, PiEyeDuotone, PiEyeSlashDuotone } from 'react-icons/pi'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'radial-gradient(rgba(175,230,127,1) 1.5px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }} />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-xl border border-dark/10 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center mb-4">
              <span className="text-white font-extrabold text-lg leading-none">Y</span>
            </div>
            <h1 className="text-2xl font-bold text-dark">Yedent CMS</h1>
            <p className="text-dark/50 text-sm mt-1">Sign in to manage your website content</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">Email address</label>
              <div className="relative">
                <PiEnvelopeDuotone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yedentghana.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-dark/20 rounded focus:outline-none focus:border-dark focus:ring-2 focus:ring-dark/10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">Password</label>
              <div className="relative">
                <PiLockKeyDuotone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-dark/20 rounded focus:outline-none focus:border-dark focus:ring-2 focus:ring-dark/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-dark/40 hover:text-dark/80 transition-colors"
                >
                  {showPassword ? <PiEyeSlashDuotone className="w-4 h-4" /> : <PiEyeDuotone className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide bg-dark text-white rounded hover:bg-dark-50 disabled:opacity-50"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm">
            <PiCaretLeftDuotone className="w-4 h-4" /> Back to the website
          </Link>
        </div>
      </div>
    </div>
  )
}