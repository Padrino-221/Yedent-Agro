'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Subsidiary } from '@/lib/api'

export default function SubsidiariesListPage() {
  return (
    <ResourceList<Subsidiary>
      title="Subsidiaries"
      description="The three arms of Yedent Agro Group."
      newHref="/admin/subsidiaries/new"
      columns={[
        {
          key: 'name',
          label: 'Name',
          render: (s) => (
            <div>
              <p className="font-semibold text-dark">{s.name}</p>
              <p className="text-xs text-dark/45">/{s.slug}</p>
            </div>
          ),
        },
        { key: 'focus_area', label: 'Focus area', render: (s) => <span className="text-dark/70">{s.focus_area}</span> },
        { key: 'tagline', label: 'Tagline', render: (s) => <span className="text-dark/60">{s.tagline || '—'}</span> },
      ]}
      searchText={(s) => `${s.name} ${s.slug} ${s.focus_area ?? ''} ${s.tagline ?? ''}`}
      fetcher={adminApi.subsidiaries.list}
      deleter={(id) => adminApi.subsidiaries.remove(id)}
      editHref={(s) => `/admin/subsidiaries/${s.id}`}
      publishable={{
        isPublished: (s) => s.is_published,
        toggle: async (s) => {
          await adminApi.subsidiaries.update(s.id, { is_published: !s.is_published })
        },
      }}
    />
  )
}