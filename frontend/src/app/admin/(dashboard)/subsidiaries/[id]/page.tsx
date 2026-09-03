'use client'

import { use } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'

const fields: FieldDef[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug (URL)', type: 'text', help: 'Leave empty to auto-generate from the name.' },
  { name: 'tagline', label: 'Tagline', type: 'text', span: 2 },
  { name: 'focus_area', label: 'Focus area', type: 'text', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'logo_url', label: 'Logo image', type: 'image', span: 2 },
  { name: 'hero_image_url', label: 'Hero image', type: 'image', span: 2 },
  { name: 'sort_order', label: 'Sort order', type: 'number', help: 'Lower numbers appear first.' },
  { name: 'is_published', label: 'Status', type: 'toggle' },
]

export default function SubsidiaryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Subsidiary"
      backHref="/admin/subsidiaries"
      fields={fields}
      autoSlug
      get={async (i) => (await adminApi.subsidiaries.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.subsidiaries.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.subsidiaries.update(i, payload)
      }}
    />
  )
}