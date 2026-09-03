'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Award } from '@/lib/api'

export default function AwardsListPage() {
  return (
    <ResourceList<Award>
      title="Awards & Recognition"
      description="Industry awards, government recognitions and excellence honors."
      newHref="/admin/awards/new"
      columns={[
        {
          key: 'title',
          label: 'Award',
          render: (a) => <span className="font-semibold text-dark">{a.title}</span>,
        },
        { key: 'conferring_body', label: 'Conferring body', render: (a) => <span className="text-dark/70">{a.conferring_body}</span> },
        {
          key: 'award_year',
          label: 'Year',
          render: (a) => <span className="font-mono text-dark/70">{a.award_year}</span>,
        },
      ]}
      searchText={(a) => `${a.title} ${a.conferring_body} ${a.award_year}`}
      fetcher={adminApi.awards.list}
      deleter={(id) => adminApi.awards.remove(id)}
      editHref={(a) => `/admin/awards/${a.id}`}
      publishable={{
        isPublished: (a) => a.is_published,
        toggle: async (a) => {
          await adminApi.awards.update(a.id, { is_published: !a.is_published })
        },
      }}
    />
  )
}