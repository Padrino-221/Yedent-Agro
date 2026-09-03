import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getSubsidiaries, getAwards } from '@/lib/api'
import Link from 'next/link'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiBuildingsDuotone, PiTrophyDuotone, PiArrowRightDuotone, PiUsersDuotone, PiLeafDuotone, PiTruckDuotone } from 'react-icons/pi'
import { subsidiaryImage } from '@/lib/images'
import { settingValue, settingRow } from '@/lib/settingsUtils'
import { SectionOrbs } from '@/components/ImpactBand'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'about_meta_description',
    'Learn about Yedent Agro Group, our subsidiaries, vision, mission, and values.'
  )

  return {
    title: 'About Us',
    description,
    openGraph: {
      title: `About Us | ${orgName}`,
      description,
    },
  }
}

export default async function AboutPage() {
  const [settings, subsidiaries, awards] = await Promise.all([
    getSettings(),
    getSubsidiaries(),
    getAwards()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'
  const tagline = settings?.tagline || 'Affordable, convenient and nutritious cereal staple foods'
  const description = settings?.about_summary || 'Yedent Agro Group of Companies is a wholly Ghanaian owned limited liability company founded in 2004, operating across the entire cereal, legumes and poultry value chain.'
  const vision = settings?.vision || 'To become a premier multi-national fortified food manufacturer...'
  const mission = settings?.mission || 'To be a preferred supplier of cereal/legume-based products...'
  const csrStatement = settings?.csr_statement || 'Our corporate social responsibility involves giving to orphanages and the needy in the regions within which the company operates.'

  // Core values — managed in the CMS (site settings → About → Core values), with a hardcoded fallback.
  // Rows are stored as { title, description } — same shape the CMS editor saves.
  const fallbackValues = [
    { title: 'Teamwork & Knowledge Sharing', description: 'We promote teamwork and exchange of varied knowledge for optimum outcomes.' },
    { title: 'The God Factor', description: 'We are in a covenant with God: entrusting the business into His able Hands.' },
    { title: 'Safety Consciousness', description: 'We aspire to build the culture of safety at all levels of the organization.' },
    { title: 'Caring & Giving', description: 'Committed to contributing our time and resources to the needy and vulnerable.' },
    { title: 'Fairness', description: 'We are committed to demonstrating fairness in every enterprise we embark on.' },
    { title: 'Transparency & Integrity', description: 'We uphold utmost integrity and the principle of being transparent in all dealings.' },
  ]
  const coreValues = settingRow(settings, 'core_values', fallbackValues).map((v) => ({
    title: v.title ?? '',
    desc: v.description ?? '',
  }))
  const valueIcons = [PiUsersDuotone, PiLeafDuotone, PiBuildingsDuotone, PiTrophyDuotone, PiTruckDuotone, PiLeafDuotone]

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="kicker mb-6">{settingValue(settings, 'about_hero_kicker', 'About Yedent Agro')}</span>
              <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
                {settingValue(settings, 'about_hero_heading', 'Building a nourished Ghana since 2004')}
              </h1>
              <p className="text-dark/75 text-lg leading-relaxed mb-6">{description}</p>
              <p className="text-dark/75 leading-relaxed mb-8">
                {settingValue(settings, 'about_hero_founder_paragraph', 'Founded by Mr. Samuel Kwame Ntim Adu and Mrs Perpetual Nana Ama Ntim Adu, Yedent Agro has grown into a leading agricultural group with three subsidiaries spanning the complete value chain.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about/subsidiaries" className="btn-lime group">
                  {settingValue(settings, 'about_hero_subs_label', 'Our Subsidiaries')}
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about/awards" className="btn-secondary group">
                  {settingValue(settings, 'about_hero_awards_label', 'Awards & Recognition')}
                  <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-lime -rotate-3 translate-x-4 translate-y-4" />
              <div className="relative aspect-[4/3] overflow-hidden border-4 border-cream bg-white">
                <Image
                  src="/about-hero.jpg"
                  alt="Yedent Agro Group"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'about_purpose_kicker', 'Our Purpose')}
            heading={settingValue(settings, 'about_purpose_heading', 'Vision & Mission')}
            description={settingValue(settings, 'about_purpose_description', 'Guiding principles that drive every decision we make.')}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime mb-4">
                <PiLeafDuotone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-dark mb-3">{settingValue(settings, 'about_vision_title', 'Our Vision')}</h3>
              <p className="text-dark/75 leading-relaxed">{vision}</p>
            </Card>
            <Card>
              <div className="w-12 h-12 rounded-lg bg-lime/20 flex items-center justify-center text-lime mb-4">
                <PiTruckDuotone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-dark mb-3">{settingValue(settings, 'about_mission_title', 'Our Mission')}</h3>
              <p className="text-dark/75 leading-relaxed">{mission}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'about_values_kicker', 'Core Values')}
            heading={settingValue(settings, 'about_values_heading', 'Principles that guide us')}
            description={settingValue(settings, 'about_values_description', 'Our shared values are deeply rooted in biblical principles of teamwork, transparency, fairness, giving and knowledge seeking.')}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              return (
                <Card key={i}>
                  <div className="w-10 h-10 rounded-lg bg-lime/20 flex items-center justify-center text-lime mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-dark mb-2">{value.title}</h3>
                  <p className="text-dark/75 text-sm leading-relaxed">{value.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Corporate Social Responsibility */}
      <section className="section-padding bg-dark">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker-light mb-6 justify-center">{settingValue(settings, 'about_csr_kicker', 'Our Commitment')}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-cream leading-[1.05] mb-6">
              {settingValue(settings, 'about_csr_heading', 'Corporate Social Responsibility')}
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed">{csrStatement}</p>
          </div>
        </div>
      </section>

      {/* Subsidiaries Quick Links */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'about_subs_kicker', 'Our Group')}
            heading={settingValue(settings, 'about_subs_heading', 'Three subsidiaries, one mission')}
            description={settingValue(settings, 'about_subs_description', 'Each subsidiary operates with specialized focus while contributing to our shared vision.')}
          />
          <div className="grid md:grid-cols-3 gap-6">
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
                    <span>{settingValue(settings, 'home_card_link_label', 'Explore')}</span>
                    <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Preview */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'about_awards_kicker', 'Recognition')}
            heading={settingValue(settings, 'about_awards_heading', 'Awarded for excellence')}
            description={settingValue(settings, 'about_awards_description', 'Our commitment to quality and social impact has been recognized by industry leaders and government bodies.')}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {awards.slice(0, 3).map((award) => (
              <Card key={award.id} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-lime/20 flex items-center justify-center text-lime">
                  <PiTrophyDuotone className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif text-dark mb-2">{award.title}</h3>
                <p className="text-dark/75 text-sm">{award.conferring_body} — {award.award_year}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/about/awards" className="btn-secondary inline-flex group">
              {settingValue(settings, 'about_awards_cta', 'View All Awards')}
              <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}