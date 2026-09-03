'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminApi, AuthError } from '@/lib/admin-api'
import { useToast } from '@/lib/toast'
import { PageHeader, Button, Loading, ErrorState, TextInput, TextArea, Field, inputClass } from '@/components/admin/ui'
import { PiCaretDownDuotone, PiPlusDuotone, PiTrashDuotone } from 'react-icons/pi'
import { pages, allSettingKeys, allRowKeys, type PageDef, type SectionDef, type RowDef } from '@/lib/settings-config'

export default function SettingsPage() {
  const router = useRouter()
  const toast = useToast()
  const [values, setValues] = useState<Record<string, string>>({})
  const [rowValues, setRowValues] = useState<Record<string, Record<string, string>[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [activePage, setActivePage] = useState<PageDef>(pages[0])
  const [openSection, setOpenSection] = useState<string>(pages[0].sections[0].id)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const openSections = useMemo(() => {
    return new Set(openSection === '' ? [] : [openSection])
  }, [openSection])

  const load = useCallback(async () => {
    setError(null)
    try {
      const settings = await adminApi.settings.get()
      const next: Record<string, string> = {}
      for (const key of allSettingKeys) {
        next[key] = settings[key] ?? ''
      }
      setValues(next)
      const rows: Record<string, Record<string, string>[]> = {}
      for (const key of allRowKeys) {
        const raw = settings[key]
        rows[key] = []
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) rows[key] = parsed as Record<string, string>[]
          } catch {
            rows[key] = []
          }
        }
      }
      setRowValues(rows)
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  function selectPage(page: PageDef) {
    setActivePage(page)
    setOpenSection(page.sections[0]?.id ?? '')
  }

  function toggleSection(id: string) {
    setOpenSection((prev) => (prev === id ? '' : id))
    requestAnimationFrame(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  async function saveSection(section: SectionDef) {
    setSavingSection(section.id)
    setError(null)
    try {
      const payload: Record<string, string | null> = {}
      for (const f of section.fields ?? []) {
        payload[f.key] = (values[f.key] ?? '').trim() === '' ? null : values[f.key]
      }
      for (const r of section.rows ?? []) {
        const rows = rowValues[r.key] ?? []
        const clean = rows.filter((row) => Object.values(row).some((v) => (v ?? '').trim() !== ''))
        payload[r.key] = clean.length ? JSON.stringify(clean) : null
      }
      await adminApi.settings.save(payload)
      toast.success(`${section.title} saved`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
      toast.error(message)
    } finally {
      setSavingSection(null)
    }
  }

  function updateRow(rowKey: string, index: number, patch: Record<string, string>) {
    setRowValues((prev) => {
      const rows = prev[rowKey] ?? []
      const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r))
      return { ...prev, [rowKey]: next }
    })
  }

  function addRow(rowKey: string, rowDef: RowDef) {
    const blank: Record<string, string> = {}
    for (const f of rowDef.fields) blank[f.key] = ''
    setRowValues((prev) => ({ ...prev, [rowKey]: [...(prev[rowKey] ?? []), blank] }))
  }

  function removeRow(rowKey: string, index: number) {
    setRowValues((prev) => ({
      ...prev,
      [rowKey]: (prev[rowKey] ?? []).filter((_, i) => i !== index),
    }))
  }

  if (loading) return <Loading />
  if (error && Object.keys(values).length === 0) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Every piece of static information on the website — pick a page on the left, edit its sections on the right."
      />

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
        {/* Left aside: website pages */}
        <aside className="lg:sticky lg:top-6 bg-white border border-dark/10 rounded-lg p-2 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <p className="px-3 pt-2 pb-2 text-xs font-bold uppercase tracking-wide text-dark/45">Website Pages</p>
          <nav className="space-y-0.5">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => selectPage(page)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${
                  activePage.id === page.id ? 'bg-lime-100 text-lime-900' : 'text-dark/65 hover:bg-dark/5 hover:text-dark'
                }`}
              >
                {page.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right: sections of the selected page */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-dark">{activePage.title}</h2>
            <p className="text-sm text-dark/50">{activePage.description}</p>
          </div>

          <div className="space-y-4">
            {activePage.sections.map((section) => {
              const isOpen = openSections.has(section.id)
              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el
                  }}
                  className="bg-white border border-dark/10 rounded-lg scroll-mt-6"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <h3 className="text-base font-bold text-dark">{section.title}</h3>
                      {section.description && <p className="text-sm text-dark/50">{section.description}</p>}
                    </div>
                    <PiCaretDownDuotone
                      className={`w-5 h-5 text-dark/40 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-dark/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                        {(section.fields ?? []).map((f) => (
                          <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                            <Field label={f.label} help={f.help}>
                              {f.type === 'textarea' ? (
                                <TextArea value={values[f.key] ?? ''} onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))} rows={3} />
                              ) : (
                                <TextInput value={values[f.key] ?? ''} onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))} />
                              )}
                            </Field>
                          </div>
                        ))}
                      </div>

                      {(section.rows ?? []).map((rowDef) => {
                        const rows = rowValues[rowDef.key] ?? []
                        return (
                          <div key={rowDef.key} className="mt-5">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-semibold text-dark">{rowDef.label}</p>
                              <Button
                                variant="secondary"
                                className="!px-3 !py-1.5 !text-xs"
                                onClick={() => addRow(rowDef.key, rowDef)}
                              >
                                <PiPlusDuotone className="w-3.5 h-3.5" /> {rowDef.addLabel}
                              </Button>
                            </div>
                            {rows.length === 0 && (
                              <p className="text-sm text-dark/50 border border-dashed border-dark/20 rounded p-4 text-center">
                                {rowDef.emptyText}
                              </p>
                            )}
                            <div className="space-y-3">
                              {rows.map((row, i) => (
                                <RowEditor key={i} row={row} index={i} rowDef={rowDef} onChange={updateRow} onRemove={removeRow} />
                              ))}
                            </div>
                          </div>
                        )
                      })}

                      <div className="mt-5 flex items-center gap-3">
                        <Button onClick={() => saveSection(section)} disabled={savingSection === section.id}>
                          {savingSection === section.id ? 'Saving…' : 'Save section'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function RowEditor({
  row,
  index,
  rowDef,
  onChange,
  onRemove,
}: {
  row: Record<string, string>
  index: number
  rowDef: RowDef
  onChange: (rowKey: string, index: number, patch: Record<string, string>) => void
  onRemove: (rowKey: string, index: number) => void
}) {
  return (
    <div className="bg-cream/70 border border-dark/10 rounded p-3 grid grid-cols-1 gap-3 items-start">
      {rowDef.fields.map((f) => (
        <div key={f.key} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 items-start">
          <label className="text-xs font-semibold text-dark/55 md:pt-2.5">{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              value={row[f.key] ?? ''}
              placeholder={f.placeholder}
              rows={2}
              onChange={(e) => onChange(rowDef.key, index, { [f.key]: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={row[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => onChange(rowDef.key, index, { [f.key]: e.target.value })}
              className={inputClass}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onRemove(rowDef.key, index)}
        className="p-2 text-dark/40 hover:text-red-600 self-start"
        aria-label={`Remove ${rowDef.label.toLowerCase()}`}
      >
        <PiTrashDuotone className="w-4 h-4" />
      </button>
    </div>
  )
}
