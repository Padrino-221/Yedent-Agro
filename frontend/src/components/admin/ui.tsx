'use client'

import { useRef, useState, type ReactNode, type ChangeEvent, type FormEvent } from 'react'
import { uploadImage, uploadVideo } from '@/lib/admin-api'
import { Dropdown } from './dropdown'
import { PiUploadSimpleDuotone, PiTrashDuotone, PiWarningCircleDuotone, PiCheckDuotone, PiCaretLeftDuotone, PiCaretRightDuotone, PiVideoCameraDuotone } from 'react-icons/pi'

// ---------- Layout primitives ----------

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-dark">{title}</h1>
        {description && <p className="text-dark/60 mt-1 text-sm max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed rounded'
  const variants: Record<string, string> = {
    primary: 'bg-dark text-white hover:bg-dark-50',
    secondary: 'border border-dark/30 text-dark hover:bg-dark hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-dark/60 hover:text-dark hover:bg-dark/5',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'green' | 'red' | 'amber' | 'blue'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-dark/5 text-dark/70',
    green: 'bg-lime-100 text-lime-800',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-sky-100 text-sky-800',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Loading() {
  return (
    <div className="py-16 flex items-center justify-center gap-3 text-dark/50">
      <span className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="py-16 text-center">
      <PiWarningCircleDuotone className="w-8 h-8 mx-auto text-red-500 mb-3" />
      <p className="text-dark/70 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="py-16 text-center border border-dashed border-dark/20 rounded-lg">
      <p className="text-dark/50 mb-4">{message}</p>
      {action}
    </div>
  )
}

// ---------- Form primitives ----------

export function Field({
  label,
  help,
  required,
  children,
}: {
  label: string
  help?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-dark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
      {help && <span className="block text-xs text-dark/50 mt-1.5">{help}</span>}
    </label>
  )
}

export const inputClass =
  'w-full px-3.5 py-2.5 text-sm bg-white border border-dark/20 rounded focus:outline-none focus:border-dark focus:ring-2 focus:ring-dark/10 placeholder:text-dark/30'

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

export function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y`}
    />
  )
}

export function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const selected = options.find((o) => o.value === value)
  return (
    <Dropdown
      block
      caret
      align="left"
      label="Select option"
      width="trigger"
      trigger={
        <span className={`${inputClass} inline-flex items-center justify-between gap-2 text-left`}>
          <span className="truncate">{selected?.label ?? 'Select…'}</span>
        </span>
      }
      items={options.map((o) => ({
        label: o.label,
        onClick: () => onChange(o.value),
      }))}
    />
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 group"
      aria-pressed={checked}
    >
      <span
        className={`w-11 h-6 rounded-full relative ${
          checked ? 'bg-lime-600' : 'bg-dark/20'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      {label && <span className="text-sm text-dark/70 group-hover:text-dark">{label}</span>}
    </button>
  )
}

export function ImageInput({
  value,
  onChange,
  help,
}: {
  value: string
  onChange: (v: string) => void
  help?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            placeholder="https://… or paste a URL"
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {help && <span className="block text-xs text-dark/50 mt-1">{help}</span>}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-lime-100 text-lime-800 rounded hover:bg-lime-200 disabled:opacity-50"
        >
          <PiUploadSimpleDuotone className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <div className="relative w-40 h-28 bg-dark/5 rounded overflow-hidden border border-dark/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 rounded flex items-center justify-center text-red-600 hover:bg-white shadow"
            aria-label="Remove image"
          >
            <PiTrashDuotone className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export function VideoInput({
  value,
  onChange,
  help,
}: {
  value: string
  onChange: (v: string) => void
  help?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadVideo(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            placeholder="https://… or paste a video URL"
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {help && <span className="block text-xs text-dark/50 mt-1">{help}</span>}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-lime-100 text-lime-800 rounded hover:bg-lime-200 disabled:opacity-50"
        >
          <PiUploadSimpleDuotone className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <div className="space-y-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <video src={value} controls muted playsInline className="w-48 h-28 bg-dark/5 rounded border border-dark/10 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700"
          >
            <PiTrashDuotone className="w-4 h-4" /> Remove video
          </button>
        </div>
      )}
    </div>
  )
}

// ---------- Schema-driven form ----------

export interface FieldDef {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'image' | 'video' | 'date'
  options?: { value: string; label: string }[]
  required?: boolean
  help?: string
  placeholder?: string
  /** Column span inside the grid; default "1". */
  span?: 1 | 2
}

export interface SchemaFormProps {
  fields: FieldDef[]
  initial: Record<string, unknown>
  /** Called with the prepared payload (empty strings → null, numbers parsed). */
  onSubmit: (payload: Record<string, unknown>) => Promise<void>
  submitLabel?: string
  onCancel?: () => void
}

export function SchemaForm({ fields, initial, onSubmit, submitLabel = 'Save', onCancel }: SchemaFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {}
    for (const f of fields) {
      const v = initial[f.name]
      if (f.type === 'toggle') {
        out[f.name] = v ? 'true' : 'false'
      } else if (f.type === 'number') {
        out[f.name] = v == null ? '' : String(v)
      } else {
        out[f.name] = v == null ? '' : String(v)
      }
    }
    return out
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function set(name: string, v: string) {
    setValues((prev) => ({ ...prev, [name]: v }))
  }

  function buildPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      const raw = values[f.name] ?? ''
      if (f.type === 'toggle') {
        payload[f.name] = raw === 'true'
      } else if (f.type === 'number') {
        payload[f.name] = raw === '' ? null : Number(raw)
      } else {
        payload[f.name] = raw === '' ? null : raw
      }
    }
    return payload
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        setError(`${f.label} is required`)
        return
      }
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit(buildPayload())
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  function renderField(f: FieldDef) {
    const value = values[f.name] ?? ''
    switch (f.type) {
      case 'textarea':
        return <TextArea value={value} onChange={(v) => set(f.name, v)} placeholder={f.placeholder} rows={5} />
      case 'number':
        return <NumberInput value={value} onChange={(v) => set(f.name, v)} placeholder={f.placeholder} />
      case 'select':
        return (
          <SelectInput
            value={value}
            onChange={(v) => set(f.name, v)}
            options={f.options ?? []}
          />
        )
      case 'toggle':
        return <Toggle checked={value === 'true'} onChange={(v) => set(f.name, v ? 'true' : 'false')} label={value === 'true' ? 'Published' : 'Draft'} />
      case 'image':
        return <ImageInput value={value} onChange={(v) => set(f.name, v)} help={f.help} />
      case 'video':
        return <VideoInput value={value} onChange={(v) => set(f.name, v)} help={f.help} />
      case 'date':
        return <TextInput type="date" value={value} onChange={(v) => set(f.name, v)} />
      default:
        return <TextInput value={value} onChange={(v) => set(f.name, v)} placeholder={f.placeholder} />
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>
      )}
      {saved && (
        <div className="px-4 py-3 bg-lime-50 border border-lime-200 text-lime-800 text-sm rounded flex items-center gap-2">
          <PiCheckDuotone className="w-4 h-4" /> Saved successfully
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((f) => (
          <div key={f.name} className={f.span === 2 ? 'md:col-span-2' : ''}>
            <Field label={f.label} help={f.type !== 'image' && f.type !== 'toggle' ? f.help : undefined} required={f.required}>
              {renderField(f)}
            </Field>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saving} variant="primary">
          {saving ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

// ---------- Pagination ----------

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  if (total === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages: number[] = []
  const start = Math.max(1, Math.min(page - 2, pageCount - 4))
  for (let i = start; i <= Math.min(pageCount, start + 4); i++) pages.push(i)

  const btn =
    'inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium border disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-dark/10">
      <p className="text-xs text-dark/50">
        Showing <span className="font-semibold text-dark/70">{from}–{to}</span> of{' '}
        <span className="font-semibold text-dark/70">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <Dropdown
            align="right"
            label="Rows per page"
            trigger={
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white border border-dark/20 rounded">
                {pageSize} / page
              </span>
            }
            items={[10, 25, 50, 100].map((n) => ({
              label: `${n} / page`,
              onClick: () => onPageSizeChange(n),
            }))}
          />
        )}
        <button
          className={`${btn} border-dark/15 text-dark/60 hover:text-dark disabled:opacity-40`}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <PiCaretLeftDuotone className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btn} ${
              p === page
                ? 'bg-dark text-white border-dark'
                : 'border-dark/15 text-dark/60 hover:text-dark hover:border-dark/40'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          className={`${btn} border-dark/15 text-dark/60 hover:text-dark disabled:opacity-40`}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <PiCaretRightDuotone className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ConfirmDelete + ConfirmDialog live in './overlays' (avoids circular imports).