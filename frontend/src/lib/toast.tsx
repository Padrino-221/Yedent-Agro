'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { PiCheckCircleDuotone, PiWarningCircleDuotone, PiInfoDuotone, PiXDuotone } from 'react-icons/pi'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  variant: ToastVariant
  message: string
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const variantStyles: Record<ToastVariant, { icon: ReactNode; ring: string; iconColor: string }> = {
  success: {
    icon: <PiCheckCircleDuotone className="w-5 h-5 text-lime-700" />,
    ring: 'border-lime-200',
    iconColor: 'text-lime-700',
  },
  error: {
    icon: <PiWarningCircleDuotone className="w-5 h-5 text-red-600" />,
    ring: 'border-red-200',
    iconColor: 'text-red-600',
  },
  info: {
    icon: <PiInfoDuotone className="w-5 h-5 text-sky-700" />,
    ring: 'border-sky-200',
    iconColor: 'text-sky-700',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = nextId.current++
      setToasts((prev) => [...prev.slice(-4), { id, variant, message }])
      window.setTimeout(() => dismiss(id), 4500)
    },
    [dismiss]
  )

  const value: ToastContextValue = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast stack — fixed top-right, layered above the sidebar */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 w-[min(92vw,380px)] pointer-events-none">
        {toasts.map((t) => {
          const s = variantStyles[t.variant]
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 bg-white border ${s.ring} rounded-lg px-4 py-3`}
            >
              <span className="mt-0.5 shrink-0">{s.icon}</span>
              <p className="text-sm text-dark/80 leading-snug flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-0.5 text-dark/35 hover:text-dark"
                aria-label="Dismiss"
              >
                <PiXDuotone className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}