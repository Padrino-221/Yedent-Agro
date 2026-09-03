import type { MetadataRoute } from 'next'
import { getProducts, getSubsidiaries, getNewsEvents } from '@/lib/api'

export const dynamic = 'force-dynamic'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/awards`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about/subsidiaries`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact/sales`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/departments`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/news`, lastModified, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/products`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []
  try {
    const [products, subsidiaries, news] = await Promise.all([
      getProducts(),
      getSubsidiaries(),
      getNewsEvents(),
    ])
    dynamicRoutes = [
      ...products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...subsidiaries.map((s) => ({
        url: `${baseUrl}/about/subsidiaries/${s.slug}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...news.map((n) => ({
        url: `${baseUrl}/news/${n.slug}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    // Backend API unavailable — return static routes only.
  }

  return [...staticRoutes, ...dynamicRoutes]
}
