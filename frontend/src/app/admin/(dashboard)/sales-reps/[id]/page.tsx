'use client'

import { use, useEffect, useState } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'
import type { Subsidiary } from '@/lib/api'

export default function SalesRepFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])

  useEffect(() => {
    adminApi.subsidiaries.list().then(setSubsidiaries).catch(() => setSubsidiaries([]))
  }, [])

  const fields: FieldDef[] = [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    { name: 'image_url', label: 'Photo', type: 'image', help: 'Portrait photo of the representative. Shown on the sales network cards.' },
    {
      name: 'subsidiary_id',
      label: 'Subsidiary',
      type: 'select',
      options: [{ value: '', label: 'None' }, ...subsidiaries.map((s) => ({ value: s.id, label: s.name }))],
    },
    { name: 'region', label: 'Region', type: 'text', required: true, help: 'e.g. Bono, Bono East, Ashanti' },
    { name: 'territory', label: 'Territory', type: 'text', help: 'e.g. Offinso Sekyere, Atwima' },
    { name: 'phone', label: 'Phone', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'sort_order', label: 'Sort order', type: 'number' },
    { name: 'is_published', label: 'Status', type: 'toggle' },
  ]

  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Sales Representative"
      backHref="/admin/sales-reps"
      fields={fields}
      get={async (i) => (await adminApi.salesReps.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.salesReps.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.salesReps.update(i, payload)
      }}
    />
  )
}