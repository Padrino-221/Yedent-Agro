'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthError } from '@/lib/admin-api'
import { PageHeader, SchemaForm, Loading, ErrorState, type FieldDef } from './ui'
import { PiCaretLeftDuotone } from 'react-icons/pi'
import { slugify } from '@/lib/slug'

export interface ResourceFormPageProps {
  id: string
  resourceLabel: string
  backHref: string
  fields: FieldDef[]
  get: (id: string) => Promise<Record<string, unknown>>
  create: (payload: Record<string, unknown>) => Promise<{ id: string }>
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>
  /** Derive slug from name when slug is left empty. */
  autoSlug?: boolean
}

export default function ResourceFormPage({
  id,
  resourceLabel,
  backHref,
  fields,
  get,
  create,
  update,
  autoSlug = false,
}: ResourceFormPageProps) {
  const router = useRouter()
  const isNew = id === 'new'
  const [initial, setInitial] = useState<Record<string, unknown> | null>(isNew ? {} : null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (isNew) return
    setError(null)
    try {
      setInitial(await get(id))
    } catch (err) {
      if (err instanceof AuthError) {
        router.replace('/admin/login')
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load')
    }
  }, [id, isNew, get, router])

  useEffect(() => {
    load()
  }, [load])

  async function handleSubmit(payload: Record<string, unknown>) {
    if (autoSlug) {
      const name = typeof payload.name === 'string' ? payload.name : ''
      const slug = typeof payload.slug === 'string' ? payload.slug : ''
      if (!slug && name) {
        payload.slug = slugify(name)
      }
    }
    if (isNew) {
      const created = await create(payload)
      router.push(`${backHref}/${created.id}`)
    } else {
      await update(id, payload)
    }
  }

  if (error && !initial && !isNew) {
    return (
      <div>
        <PageHeader title={resourceLabel} />
        <ErrorState message={error} onRetry={load} />
      </div>
    )
  }

  if (!initial) return <Loading />

  return (
    <div>
      <PageHeader
        title={isNew ? `New ${resourceLabel}` : `Edit ${resourceLabel}`}
        actions={
          <Link href={backHref} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-dark/60 hover:text-dark">
            <PiCaretLeftDuotone className="w-4 h-4" /> Back to list
          </Link>
        }
      />
      <div className="bg-white border border-dark/10 rounded-lg p-6">
        <SchemaForm
          fields={fields}
          initial={initial}
          onSubmit={handleSubmit}
          submitLabel={isNew ? 'Create' : 'Save changes'}
        />
      </div>
    </div>
  )
}