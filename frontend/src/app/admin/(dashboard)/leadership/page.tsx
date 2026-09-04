'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Leader } from '@/lib/api'

export default function LeadershipListPage() {
  return (
    <ResourceList<Leader>
      title="Leadership"
      description="High-level leaders (CEO and others) who are not tied to a department. Their cards appear on the site's Leadership page, above the Corporate Functions section."
      newHref="/admin/leadership/new"
      columns={[
        {
          key: 'image_url',
          label: 'Photo',
          render: (l) =>
            l.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={l.image_url} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="w-12 h-12 rounded-full bg-dark/5 inline-flex items-center justify-center text-dark/40">—</span>
            ),
        },
        {
          key: 'name',
          label: 'Name',
          render: (l) => <span className="font-semibold text-dark">{l.name}</span>,
        },
        {
          key: 'position',
          label: 'Position',
          render: (l) => <span className="text-dark/70">{l.position}</span>,
        },
      ]}
      searchText={(l) => `${l.name} ${l.position}`}
      fetcher={adminApi.leaders.list}
      deleter={(id) => adminApi.leaders.remove(id)}
      editHref={(l) => `/admin/leadership/${l.id}`}
      publishable={{
        isPublished: (l) => l.is_published,
        toggle: async (l) => {
          await adminApi.leaders.update(l.id, { is_published: !l.is_published })
        },
      }}
    />
  )
}