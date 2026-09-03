'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { Product } from '@/lib/api'
import { Badge } from '@/components/admin/ui'

const sectorLabels: Record<string, string> = {
  consumer: 'Consumer',
  industrial: 'Industrial',
  poultry_feed: 'Poultry feed',
}

export default function ProductsListPage() {
  return (
    <ResourceList<Product>
      title="Products"
      description="Full product catalog across all three subsidiaries."
      newHref="/admin/products/new"
      columns={[
        {
          key: 'name',
          label: 'Product',
          render: (p) => (
            <div>
              <p className="font-semibold text-dark">{p.name}</p>
              <p className="text-xs text-dark/45">/{p.slug}</p>
            </div>
          ),
        },
        {
          key: 'sector',
          label: 'Sector',
          render: (p) => <Badge tone="green">{sectorLabels[p.sector] ?? p.sector}</Badge>,
        },
        {
          key: 'subsidiary',
          label: 'Subsidiary',
          render: (p) => <span className="text-dark/60 text-xs">{p.subsidiary_name || '—'}</span>,
        },
        {
          key: 'fda_registration',
          label: 'FDA',
          render: (p) => <span className="text-dark/60 text-xs">{p.fda_registration || '—'}</span>,
        },
      ]}
      searchText={(p) => `${p.name} ${p.slug} ${p.sector} ${p.description ?? ''} ${p.fda_registration ?? ''}`}
      filters={[
        {
          key: 'sector',
          label: 'Sector',
          options: [
            { value: 'consumer', label: 'Consumer / Institutional' },
            { value: 'industrial', label: 'Industrial Bulk' },
            { value: 'poultry_feed', label: 'Poultry Feed' },
          ],
          apply: (p, v) => p.sector === v,
        },
      ]}
      fetcher={adminApi.products.list}
      deleter={(id) => adminApi.products.remove(id)}
      editHref={(p) => `/admin/products/${p.id}`}
      publishable={{
        isPublished: (p) => p.is_published,
        toggle: async (p) => {
          await adminApi.products.update(p.id, { is_published: !p.is_published })
        },
      }}
    />
  )
}