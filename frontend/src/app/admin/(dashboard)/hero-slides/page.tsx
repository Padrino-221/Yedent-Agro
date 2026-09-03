'use client'

import ResourceList from '@/components/admin/ResourceList'
import { adminApi } from '@/lib/admin-api'
import type { HeroSlide } from '@/lib/api'

export default function HeroSlidesListPage() {
  return (
    <ResourceList<HeroSlide>
      title="Hero Slides"
      description="The rotating banner on the homepage."
      newHref="/admin/hero-slides/new"
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (h) => (
            <div>
              <p className="font-semibold text-dark">{h.title}</p>
              <p className="text-xs text-dark/45">{h.subtitle || '—'}</p>
            </div>
          ),
        },
        {
          key: 'slide_type',
          label: 'Type',
          render: (h) => <span className="text-dark/70 capitalize">{h.slide_type}</span>,
        },
        {
          key: 'subsidiary_name',
          label: 'Subsidiary',
          render: (h) => <span className="text-dark/60 text-xs">{h.subsidiary_name || '—'}</span>,
        },
        {
          key: 'cta',
          label: 'CTA',
          render: (h) => (
            <span className="text-dark/60 text-xs">
              {h.cta_label || '—'} {h.cta_href ? `→ ${h.cta_href}` : ''}
            </span>
          ),
        },
      ]}
      searchText={(h) => `${h.title} ${h.subtitle ?? ''} ${h.slide_type} ${h.subsidiary_name ?? ''} ${h.cta_href ?? ''}`}
      fetcher={adminApi.heroSlides.list}
      deleter={(id) => adminApi.heroSlides.remove(id)}
      editHref={(h) => `/admin/hero-slides/${h.id}`}
      publishable={{
        isPublished: (h) => h.is_published,
        toggle: async (h) => {
          await adminApi.heroSlides.update(h.id, { is_published: !h.is_published })
        },
      }}
    />
  )
}