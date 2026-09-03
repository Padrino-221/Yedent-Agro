'use client'

import { use } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'

const fields: FieldDef[] = [
  { name: 'title', label: 'Award title', type: 'text', required: true },
  { name: 'award_year', label: 'Year', type: 'number', required: true },
  { name: 'conferring_body', label: 'Conferring body', type: 'text', required: true, help: 'e.g. AGI Awards, GRA, Stanford Seed' },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'image_url', label: 'Image', type: 'image', span: 2 },
  { name: 'press_release_url', label: 'Press release link', type: 'text', span: 2 },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
  { name: 'is_published', label: 'Status', type: 'toggle' },
]

export default function AwardFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Award"
      backHref="/admin/awards"
      fields={fields}
      get={async (i) => (await adminApi.awards.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.awards.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.awards.update(i, payload)
      }}
    />
  )
}