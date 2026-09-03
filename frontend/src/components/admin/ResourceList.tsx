'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { AuthError } from '@/lib/admin-api'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast'
import { PageHeader, Button, Loading, ErrorState, EmptyState, Badge, Pagination } from './ui'
import { Dropdown } from './dropdown'
import { ConfirmDialog } from './overlays'
import {
  PiPlusDuotone,
  PiPencilSimpleDuotone,
  PiTrashDuotone,
  PiDotsThreeVerticalDuotone,
  PiCheckCircleDuotone,
  PiCircleDuotone,
  PiCaretDownDuotone,
} from 'react-icons/pi'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  className?: string
}

export interface ListFilter<T> {
  key: string
  label: string
  options: { value: string; label: string }[]
  apply: (row: T, value: string) => boolean
}

export interface ResourceListProps<T extends { id: string }> {
  title: string
  description?: string
  newHref: string
  columns: Column<T>[]
  fetcher: () => Promise<T[]>
  deleter: (id: string) => Promise<void>
  editHref: (row: T) => string
  searchText?: (row: T) => string
  filters?: ListFilter<T>[]
  publishable?: {
    isPublished: (row: T) => boolean
    toggle: (row: T) => Promise<void>
  }
  onChanged?: () => void
}

export default function ResourceList<T extends { id: string }>({
  title,
  description,
  newHref,
  columns,
  fetcher,
  deleter,
  editHref,
  searchText,
  filters,
  publishable,
  onChanged,
}: ResourceListProps<T>) {
  const router = useRouter()
  const toast = useToast()
  const [rows, setRows] = useState<T[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const load = useCallback(async () => {
    setError(null)
    try {
      setRows(await fetcher())
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load')
    }
  }, [fetcher, router])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    if (!rows) return rows
    let out = rows
    const q = query.trim().toLowerCase()
    if (q) {
      const search = searchText ?? ((row: T) => String(row.id))
      out = out.filter((row) => search(row).toLowerCase().includes(q))
    }
    for (const f of filters ?? []) {
      const v = filterValues[f.key]
      if (v) out = out.filter((row) => f.apply(row, v))
    }
    return out
  }, [rows, query, searchText, filters, filterValues])

  // Reset to the first page whenever the search, filters or page size change.
  useEffect(() => {
    setPage(1)
  }, [query, pageSize, filterValues])

  const pageRows = useMemo(() => {
    if (!filtered) return null
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  async function handleToggle(row: T) {
    if (!publishable) return
    setTogglingId(row.id)
    try {
      await publishable.toggle(row)
      const published = !publishable.isPublished(row)
      toast.success(`${published ? 'Published' : 'Moved to drafts'}`)
      await load()
      onChanged?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      toast.error(message)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(row: T) {
    setDeleting(true)
    try {
      await deleter(row.id)
      toast.success('Deleted successfully')
      await load()
      onChanged?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed'
      setError(message)
      toast.error(message)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Link href={newHref}>
            <Button>
              <PiPlusDuotone className="w-4 h-4" /> New
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full max-w-xs px-3.5 py-2 text-sm bg-white border border-dark/20 rounded focus:outline-none focus:border-dark placeholder:text-dark/30"
        />
        {filters?.map((f) => {
          const active = f.options.find((o) => o.value === filterValues[f.key])
          return (
            <Dropdown
              key={f.key}
              align="left"
              label={f.label}
              trigger={
                <span className="inline-flex items-center gap-2 px-3.5 py-2 text-sm bg-white border border-dark/20 rounded hover:border-dark/40">
                  <span className="text-dark/50">{f.label}:</span>
                  <span className="font-semibold text-dark">{active?.label ?? 'All'}</span>
                  <PiCaretDownDuotone className="w-3.5 h-3.5 text-dark/40" />
                </span>
              }
              items={[
                {
                  label: 'All',
                  onClick: () => setFilterValues((prev) => ({ ...prev, [f.key]: '' })),
                },
                ...f.options.map((o) => ({
                  label: o.label,
                  onClick: () => setFilterValues((prev) => ({ ...prev, [f.key]: o.value })),
                })),
              ]}
            />
          )
        })}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>
      )}

      {!rows && !error && <Loading />}
      {error && !rows && <ErrorState message={error} onRetry={load} />}

      {rows && filtered && filtered.length === 0 && (
        <EmptyState
          message={query ? `No matches for “${query}”.` : 'Nothing here yet.'}
          action={
            !query ? (
              <Link href={newHref}>
                <Button>
                  <PiPlusDuotone className="w-4 h-4" /> Add your first item
                </Button>
              </Link>
            ) : undefined
          }
        />
      )}

      {rows && filtered && filtered.length > 0 && (
        <div className="bg-white border border-dark/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark text-white text-left">
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 font-semibold text-xs uppercase tracking-wide ${c.className ?? ''}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/10">
                {(pageRows ?? []).map((row) => (
                  <tr key={row.id} className="hover:bg-cream/60">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ''}`}>
                        {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        {publishable && (
                          <span className="mr-1">
                            {publishable.isPublished(row) ? (
                              <Badge tone="green">Published</Badge>
                            ) : (
                              <Badge tone="amber">Draft</Badge>
                            )}
                          </span>
                        )}
                        <Dropdown
                          label={`Actions for ${String((row as Record<string, unknown>).name ?? row.id)}`}
                          trigger={
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded border border-dark/15 text-dark/60 hover:text-dark hover:border-dark/40">
                              <PiDotsThreeVerticalDuotone className="w-4 h-4" />
                            </span>
                          }
                          items={[
                            {
                              label: publishable?.isPublished(row) ? 'Move to draft' : 'Publish',
                              icon: publishable?.isPublished(row) ? (
                                <PiCircleDuotone className="w-4 h-4 text-dark/40" />
                              ) : (
                                <PiCheckCircleDuotone className="w-4 h-4 text-lime-700" />
                              ),
                              disabled: !publishable || togglingId === row.id,
                              onClick: () => handleToggle(row),
                            },
                            {
                              label: 'Edit',
                              icon: <PiPencilSimpleDuotone className="w-4 h-4" />,
                              onClick: () => router.push(editHref(row)),
                            },
                            { divider: true },
                            {
                              label: 'Delete',
                              icon: <PiTrashDuotone className="w-4 h-4" />,
                              danger: true,
                              onClick: () => setDeleteTarget(row),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) return handleDelete(deleteTarget)
        }}
        message={`Delete ${String((deleteTarget as Record<string, unknown> | null)?.name ?? 'this item')}? This action cannot be undone.`}
        busy={deleting}
      />
    </div>
  )
}