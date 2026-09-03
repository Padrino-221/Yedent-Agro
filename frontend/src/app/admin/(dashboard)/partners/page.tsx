'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Partner } from '@/lib/api'

export default function PartnersListPage() {
  return (
    <ResourceList<Partner>
      title="Partners"
      description="Organizations shown in the partner logo carousel on the landing page."
      newHref="/admin/partners/new"
      columns={[
        {
          key: 'logo_url',
          label: 'Logo',
          render: (p) =>
            p.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo_url} alt="" className="h-8 w-auto max-w-[140px] object-contain" />
            ) : (
              <span className="text-dark/40">—</span>
            ),
        },
        {
          key: 'name',
          label: 'Partner',
          render: (p) => <span className="font-semibold text-dark">{p.name}</span>,
        },
      ]}
      searchText={(p) => p.name}
      fetcher={adminApi.partners.list}
      deleter={(id) => adminApi.partners.remove(id)}
      editHref={(p) => `/admin/partners/${p.id}`}
      publishable={{
        isPublished: (p) => p.is_published,
        toggle: async (p) => {
          await adminApi.partners.update(p.id, { is_published: !p.is_published })
        },
      }}
    />
  )
}
