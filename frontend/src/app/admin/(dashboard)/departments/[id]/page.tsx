'use client'

import { use, useEffect, useState } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'
import type { Subsidiary } from '@/lib/api'

export default function DepartmentFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])

  useEffect(() => {
    adminApi.subsidiaries.list().then(setSubsidiaries).catch(() => setSubsidiaries([]))
  }, [])

  const fields: FieldDef[] = [
    { name: 'name', label: 'Department name', type: 'text', required: true },
    { name: 'slug', label: 'Slug (URL)', type: 'text', help: 'Leave empty to auto-generate from the name.' },
    {
      name: 'subsidiary_id',
      label: 'Subsidiary',
      type: 'select',
      options: [{ value: '', label: 'Group-level (no subsidiary)' }, ...subsidiaries.map((s) => ({ value: s.id, label: s.name }))],
    },
    { name: 'head_of_department', label: 'Head of department', type: 'text' },
    { name: 'head_image_url', label: 'Head photo', type: 'image', help: 'Portrait photo of the head of department. Shown on the leadership page cards.' },
    { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    { name: 'sort_order', label: 'Sort order', type: 'number', help: 'Lower numbers appear first.' },
  ]

  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Department"
      backHref="/admin/departments"
      fields={fields}
      autoSlug
      get={async (i) => (await adminApi.departments.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.departments.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.departments.update(i, payload)
      }}
    />
  )
}