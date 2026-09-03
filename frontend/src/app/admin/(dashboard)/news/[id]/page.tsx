'use client'

import { use } from 'react'
import ResourceFormPage from '@/components/admin/ResourceFormPage'
import { adminApi } from '@/lib/admin-api'
import type { FieldDef } from '@/components/admin/ui'

const fields: FieldDef[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'slug', label: 'Slug (URL)', type: 'text', help: 'Leave empty to auto-generate from the title.' },
  { name: 'type', label: 'Type', type: 'select', options: [{ value: 'news', label: 'News' }, { value: 'event', label: 'Event' }] },
  { name: 'event_date', label: 'Event date', type: 'date', help: 'Only used for events.' },
  { name: 'summary', label: 'Summary', type: 'textarea', span: 2, help: 'Short excerpt shown on listing pages.' },
  { name: 'body', label: 'Full story', type: 'textarea', span: 2 },
  { name: 'image_url', label: 'Cover image', type: 'image', span: 2 },
  { name: 'video_url', label: 'Video URL', type: 'text', help: 'Optional YouTube link.' },
  { name: 'published_at', label: 'Publish date', type: 'date', help: 'Controls ordering on the news page.' },
  { name: 'is_published', label: 'Status', type: 'toggle' },
]

export default function NewsFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <ResourceFormPage
      id={id}
      resourceLabel="News / Event"
      backHref="/admin/news"
      fields={fields}
      autoSlug
      get={async (i) => (await adminApi.news.get(i)) as unknown as Record<string, unknown>}
      create={async (payload) => {
        const created = await adminApi.news.create(payload)
        return { id: created.id }
      }}
      update={async (i, payload) => {
        await adminApi.news.update(i, payload)
      }}
    />
  )
}