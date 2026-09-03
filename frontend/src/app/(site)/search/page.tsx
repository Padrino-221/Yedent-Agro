import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSettings, getProducts, getSubsidiaries, getNewsEvents } from '@/lib/api'
import { Card } from '@/components/SectionComponents'
import { SectionOrbs } from '@/components/ImpactBand'
import { PiMagnifyingGlassDuotone, PiArrowRightDuotone, PiNewspaperDuotone, PiCalendarDuotone, PiPackageDuotone, PiSquaresFourDuotone } from 'react-icons/pi'
import { sectorImage, newsImage, subsidiaryImage } from '@/lib/images'
import { settingValue } from '@/lib/settingsUtils'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string | string[] | undefined }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = await searchParams
  const query = Array.isArray(q) ? q[0] : q
  return {
    title: query?.trim() ? `Search: ${query.trim()}` : 'Search',
  }
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams
  const raw = Array.isArray(q) ? q[0] : q
  const query = (raw ?? '').trim()

  const [settings, products, subsidiaries, news] = await Promise.all([
    getSettings(),
    getProducts(),
    getSubsidiaries(),
    getNewsEvents(),
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  if (!query) {
    return (
      <>
        <section className="section-padding bg-cream relative overflow-hidden">
          <SectionOrbs />
          <div className="container-premium relative">
            <div className="max-w-3xl mx-auto text-center py-10">
              <span className="kicker mb-6 justify-center">Site Search</span>
              <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">Search {orgName}</h1>
              <p className="text-dark/75 text-lg leading-relaxed">
                Type a keyword into the search bar above to find products, news and subsidiaries.
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  const ql = query.toLowerCase()
  const searchable = (...values: (string | null | undefined)[]) =>
    values.some((v) => v?.toLowerCase().includes(ql))

  const productHits = products.filter((p) =>
    searchable(p.name, p.description, p.sector, p.category, p.subsidiary_name)
  )
  const subsidiaryHits = subsidiaries.filter((s) =>
    searchable(s.name, s.focus_area, s.description, s.tagline)
  )
  const newsHits = news.filter((n) =>
    searchable(n.title, n.summary, n.type)
  )
  const total = productHits.length + subsidiaryHits.length + newsHits.length

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="kicker mb-6 justify-center">Site Search</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              Results for “{query}”
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {total === 0
                ? `No matches for “${query}”.`
                : `${total} result${total === 1 ? '' : 's'} across products, subsidiaries and news.`}
            </p>
          </div>
        </div>
      </section>

      {total === 0 ? (
        <section className="section-padding bg-white">
          <div className="container-premium text-center py-16">
            <PiMagnifyingGlassDuotone className="w-16 h-16 mx-auto mb-4 text-lime/40" />
            <h2 className="text-2xl font-serif text-dark mb-2">Nothing found</h2>
            <p className="text-dark/75 max-w-md mx-auto mb-8">
              Try a different keyword, or browse the site directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/products" className="pill-tag">Browse products</Link>
              <Link href="/news" className="pill-tag">News &amp; events</Link>
              <Link href="/about/subsidiaries" className="pill-tag">Subsidiaries</Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {subsidiaryHits.length > 0 && (
            <section className="section-padding bg-white">
              <div className="container-premium">
                <div className="flex items-center gap-2 text-lime font-bold uppercase tracking-wider text-sm mb-6">
                  <PiSquaresFourDuotone className="w-4 h-4" />
                  Subsidiaries ({subsidiaryHits.length})
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subsidiaryHits.map((sub) => (
                    <Link key={sub.id} href={`/about/subsidiaries/${sub.slug}`} className="block h-full group">
                      <Card className="h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden mb-5">
                          <Image
                            src={subsidiaryImage(sub.slug)}
                            alt={sub.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-xl font-serif text-dark mb-2">{sub.name}</h3>
                        <p className="text-dark/75 leading-relaxed mb-4 line-clamp-2 flex-1">{sub.description}</p>
                        <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-4 transition-all">
                          <span>{settingValue(settings, 'subsidiaries_card_link_label', 'Explore')}</span>
                          <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {productHits.length > 0 && (
            <section className="section-padding bg-cream">
              <div className="container-premium">
                <div className="flex items-center gap-2 text-lime font-bold uppercase tracking-wider text-sm mb-6">
                  <PiPackageDuotone className="w-4 h-4" />
                  Products ({productHits.length})
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productHits.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="block h-full group">
                      <Card className="h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden mb-5">
                          <Image
                            src={sectorImage(product.sector)}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-xl font-serif text-dark mb-2">{product.name}</h3>
                        <p className="text-dark/75 leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>
                        <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-4 transition-all">
                          <span>{settingValue(settings, 'products_card_link_label', 'View Details')}</span>
                          <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {newsHits.length > 0 && (
            <section className="section-padding bg-white">
              <div className="container-premium">
                <div className="flex items-center gap-2 text-lime font-bold uppercase tracking-wider text-sm mb-6">
                  <PiNewspaperDuotone className="w-4 h-4" />
                  News &amp; Events ({newsHits.length})
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsHits.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="block">
                      <Card className="h-full">
                        <div className="relative aspect-[4/3] overflow-hidden mb-4">
                          <Image
                            src={newsImage}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-lime font-medium mb-2">
                          {item.type === 'event' ? (
                            <>
                              <PiCalendarDuotone className="w-3 h-3" /> Event
                            </>
                          ) : (
                            <>
                              <PiNewspaperDuotone className="w-3 h-3" /> News
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-serif text-dark mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-dark/75 text-sm leading-relaxed mb-4 line-clamp-2">{item.summary}</p>
                        <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>{settingValue(settings, 'news_readmore_label', 'Read More')}</span>
                          <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
