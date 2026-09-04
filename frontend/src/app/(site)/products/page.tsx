import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getProducts, getSubsidiaries } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiArrowRightDuotone } from 'react-icons/pi'
import { sectorImage } from '@/lib/images'
import { settingValue } from '@/lib/settingsUtils'
import { ImpactBand, SectionOrbs } from '@/components/ImpactBand'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'products_meta_description',
    'Explore Yedent Agro\'s product portfolio: fortified consumer foods, industrial bulk ingredients, and poultry feed.'
  )

  return {
    title: 'Products',
    description,
    openGraph: {
      title: `Products | ${orgName}`,
      description,
    },
  }
}

export default async function ProductsPage() {
  const [settings, products, subsidiaries] = await Promise.all([
    getSettings(),
    getProducts(),
    getSubsidiaries()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  const groupedSubsidiaries = subsidiaries
    .map((sub) => ({
      sub,
      items: products.filter((p) => p.subsidiary_id === sub.id),
    }))
    .filter((g) => g.items.length > 0)

  const unassigned = products.filter((p) => !p.subsidiary_id)

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'products_hero_kicker', 'Our Portfolio')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'products_hero_heading', 'Products for every need')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'products_hero_description', 'Explore our products organized by the subsidiary that produces them — from fortified consumer foods to industrial bulk ingredients and complete poultry feed solutions.')}
            </p>
          </div>

          {/* Subsidiary index chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {groupedSubsidiaries.map(({ sub }) => (
              <a
                key={sub.id}
                href={`#${sub.slug}`}
                className="pill-tag"
              >
                {sub.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ImpactBand
        kicker="Three Sectors, Every Table"
        heading="A portfolio built around real needs"
        body="From fortified consumer foods and industrial bulk ingredients to complete poultry feed, every product is made in-house by a member of the Yedent group."
      />

      {/* Products grouped by subsidiary */}
      {groupedSubsidiaries.map(({ sub, items }, idx) => (
        <section
          key={sub.id}
          id={sub.slug}
          className={`section-padding scroll-mt-28 ${idx % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
        >
          <div className="container-premium">
            <SectionHeader
              kicker={sub.focus_area}
              heading={`${sub.name}`}
              description={`${items.length} product${items.length > 1 ? 's' : ''} — ${sub.description}`}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
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
                      <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Unassigned products */}
      {unassigned.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'products_unassigned_kicker', 'Yedent Agro Group')}
              heading={settingValue(settings, 'products_unassigned_heading', 'Additional products')}
              description={settingValue(settings, 'products_unassigned_description', 'Products from across the group.')}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unassigned.map((product) => (
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
                      <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
