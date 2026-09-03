'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { NewsEvent } from '@/lib/api'
import { Badge } from '@/components/admin/ui'

export default function NewsListPage() {
  return (
    <ResourceList<NewsEvent>
      title="News & Events"
      description="Press releases and upcoming events."
      newHref="/admin/news/new"
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (n) => (
            <div>
              <p className="font-semibold text-dark">{n.title}</p>
              <p className="text-xs text-dark/45">/{n.slug}</p>
            </div>
          ),
        },
        {
          key: 'type',
          label: 'Type',
          render: (n) => <Badge tone={n.type === 'event' ? 'blue' : 'neutral'}>{n.type}</Badge>,
        },
        {
          key: 'published_at',
          label: 'Published',
          render: (n) => (
            <span className="text-dark/60 text-xs">
              {n.published_at ? new Date(n.published_at).toLocaleDateString() : '—'}
            </span>
          ),
        },
      ]}
      searchText={(n) => `${n.title} ${n.slug} ${n.summary ?? ''} ${n.type}`}
      filters={[
        {
          key: 'type',
          label: 'Type',
          options: [
            { value: 'news', label: 'News' },
            { value: 'event', label: 'Event' },
          ],
          apply: (n, v) => n.type === v,
        },
      ]}
      fetcher={adminApi.news.list}
      deleter={(id) => adminApi.news.remove(id)}
      editHref={(n) => `/admin/news/${n.id}`}
      publishable={{
        isPublished: (n) => n.is_published,
        toggle: async (n) => {
          await adminApi.news.update(n.id, { is_published: !n.is_published })
        },
      }}
    />
  )
}