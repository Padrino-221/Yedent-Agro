import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getSubsidiaries } from '@/lib/api'
import Link from 'next/link'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiBuildingsDuotone, PiUsersDuotone, PiLeafDuotone, PiTruckDuotone, PiArrowRightDuotone } from 'react-icons/pi'
import { subsidiaryImage } from '@/lib/images'
import { settingValue, settingRow } from '@/lib/settingsUtils'
import { ImpactBand, SectionOrbs } from '@/components/ImpactBand'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'subsidiaries_meta_description',
    'Explore the three subsidiaries of Yedent Agro Group: Yedent Agro Foods, Yedent Agro Bulk, and Naple Betta Farms.'
  )

  return {
    title: 'Our Subsidiaries',
    description,
    openGraph: {
      title: `Our Subsidiaries | ${orgName}`,
      description,
    },
  }
}

export default async function SubsidiariesPage() {
  const [settings, subsidiaries] = await Promise.all([
    getSettings(),
    getSubsidiaries()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  const chainCards = settingRow(settings, 'subsidiaries_chain_cards', [
    { heading: 'Farming & Sourcing', body: 'Naple Betta Farms manages the integrated poultry value chain and sources quality raw materials.' },
    { heading: 'Processing & Fortification', body: 'Yedent Agro Foods produces fortified cereal-legume foods; Yedent Agro Bulk produces industrial semi-finished goods.' },
    { heading: 'Distribution & Sales', body: 'Nationwide sales network covering Bono, Bono East, and Ashanti regions with dedicated representatives.' },
  ])
  const chainIcons = [PiLeafDuotone, PiBuildingsDuotone, PiTruckDuotone]

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'subsidiaries_hero_kicker', 'Our Group')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'subsidiaries_hero_heading', 'Three subsidiaries, one mission')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'subsidiaries_hero_description', 'Yedent Agro operates through three specialized subsidiaries, each focused on a critical segment of the agricultural value chain — from farm to fork.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {subsidiaries.map((sub) => (
              <Link key={sub.id} href={`/about/subsidiaries/${sub.slug}`} className="card-premium overflow-hidden h-full group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={subsidiaryImage(sub.slug)}
                    alt={sub.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-dark mb-3">{sub.name}</h3>
                  <p className="text-dark/75 leading-relaxed mb-6">{sub.description}</p>
                  <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-4 transition-all">
                    <span>{settingValue(settings, 'subsidiaries_card_link_label', 'Explore')}</span>
                    <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ImpactBand
        kicker="One Integrated Group"
        heading="Better together, from farm to fork"
        body="Each subsidiary specializes in one stage of the value chain, but together they deliver an unbroken journey — sourcing, fortification and nationwide distribution under one roof."
      />

      {/* Value Chain Overview */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'subsidiaries_chain_kicker', 'Integrated Value Chain')}
            heading={settingValue(settings, 'subsidiaries_chain_heading', 'From farm to fork')}
            description={settingValue(settings, 'subsidiaries_chain_description', 'Our subsidiaries work together to create a seamless agricultural value chain, ensuring quality at every step.')}
          />
          <div className="grid md:grid-cols-3 gap-8">
            {chainCards.map((card, i) => {
              const Icon = chainIcons[i % chainIcons.length]
              return (
                <Card key={i} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-lime/20 flex items-center justify-center text-lime">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif text-dark mb-2">{card.heading}</h3>
                  <p className="text-dark/75">{card.body}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}