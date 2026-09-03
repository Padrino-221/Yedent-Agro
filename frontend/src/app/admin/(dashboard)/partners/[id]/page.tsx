'use client'

import { use } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'

const fields: FieldDef[] = [
  { name: 'name', label: 'Partner name', type: 'text', required: true, help: 'e.g. Ghana Food & Drugs Authority' },
  { name: 'logo_url', label: 'Logo', type: 'image', span: 2, required: true, help: 'Logo image (PNG/SVG/JPG). Shown in the landing page carousel.' },
  { name: 'sort_order', label: 'Sort order', type: 'number', help: 'Lower numbers appear first.' },
  { name: 'is_published', label: 'Status', type: 'toggle' },
]

export default function PartnerFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Partner"
      backHref="/admin/partners"
      fields={fields}
      get={async (i) => (await adminApi.partners.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.partners.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.partners.update(i, payload)
      }}
    />
  )
}
