'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { SalesRep } from '@/lib/api'

export default function SalesRepsListPage() {
  return (
    <ResourceList<SalesRep>
      title="Sales Representatives"
      description="Regional sales network directory."
      newHref="/admin/sales-reps/new"
      columns={[
        { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-dark">{r.name}</span> },
        { key: 'region', label: 'Region', render: (r) => <span className="text-dark/70">{r.region}</span> },
        { key: 'territory', label: 'Territory', render: (r) => <span className="text-dark/60">{r.territory || '—'}</span> },
        { key: 'phone', label: 'Phone', render: (r) => <span className="text-dark/70">{r.phone}</span> },
        { key: 'subsidiary_name', label: 'Subsidiary', render: (r) => <span className="text-dark/50 text-xs">{r.subsidiary_name || '—'}</span> },
      ]}
      searchText={(r) => `${r.name} ${r.region} ${r.territory ?? ''} ${r.phone} ${r.subsidiary_name ?? ''}`}
      fetcher={adminApi.salesReps.list}
      deleter={(id) => adminApi.salesReps.remove(id)}
      editHref={(r) => `/admin/sales-reps/${r.id}`}
      publishable={{
        isPublished: (r) => r.is_published,
        toggle: async (r) => {
          await adminApi.salesReps.update(r.id, { is_published: !r.is_published })
        },
      }}
    />
  )
}