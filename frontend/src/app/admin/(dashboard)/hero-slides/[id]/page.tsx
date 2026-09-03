'use client'

import { use, useEffect, useState } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'
import type { Subsidiary } from '@/lib/api'

export default function HeroSlideFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])

  useEffect(() => {
    adminApi.subsidiaries.list().then(setSubsidiaries).catch(() => setSubsidiaries([]))
  }, [])

  const fields: FieldDef[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text', span: 2 },
    { name: 'description', label: 'Description', type: 'textarea', span: 2 },
    { name: 'image_url', label: 'Background image', type: 'image', span: 2, help: 'Recommended wide (16:9) image. Used when no video is set.' },
    { name: 'video_url', label: 'Background video', type: 'video', span: 2, help: 'Optional MP4/WEBM background. If set, it takes precedence over the image.' },
    { name: 'slide_type', label: 'Slide type', type: 'select', options: [{ value: 'company', label: 'Company' }, { value: 'subsidiary', label: 'Subsidiary' }] },
    {
      name: 'subsidiary_id',
      label: 'Linked subsidiary',
      type: 'select',
      options: [{ value: '', label: 'None' }, ...subsidiaries.map((s) => ({ value: s.id, label: s.name }))],
    },
    { name: 'cta_label', label: 'Button label', type: 'text', help: 'e.g. Explore Our Products' },
    { name: 'cta_href', label: 'Button link', type: 'text', help: 'e.g. /products' },
    { name: 'sort_order', label: 'Sort order', type: 'number' },
    { name: 'is_published', label: 'Status', type: 'toggle' },
  ]

  return (
    <ResourceFormPage
      id={id}
      resourceLabel="Hero Slide"
      backHref="/admin/hero-slides"
      fields={fields}
      get={async (i) => (await adminApi.heroSlides.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.heroSlides.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.heroSlides.update(i, payload)
      }}
    />
  )
}