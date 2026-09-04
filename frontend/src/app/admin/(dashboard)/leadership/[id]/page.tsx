'use client'

import { use } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'

const fields: FieldDef[] = [
  { name: 'image_url', label: 'Photo', type: 'image', span: 2, required: true, help: 'Portrait photo (square works best). Uploaded to Cloudinary.' },
  { name: 'name', label: 'Full name', type: 'text', required: true, help: 'e.g. Dr. Kwame Yedent' },
  { name: 'position', label: 'Position', type: 'text', required: true, help: 'e.g. Chief Executive Officer' },
  { name: 'bio', label: 'Bio', type: 'textarea', span: 2, help: 'Full profile shown on the leader\'s profile page.' },
  { name: 'sort_order', label: 'Sort order', type: 'number', help: 'Lower numbers appear first.' },
  { name: 'is_published', label: 'Status', type: 'toggle' },
]

export default function LeaderFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Leader"
      backHref="/admin/leadership"
      fields={fields}
      get={async (i) => (await adminApi.leaders.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.leaders.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.leaders.update(i, payload)
      }}
    />
  )
}