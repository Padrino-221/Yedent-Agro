import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getSubsidiaries, getProducts, getAwards, getNewsEvents, getHeroSlides } from '@/lib/api'
import HeroCarousel from '@/components/HeroCarousel'
import YouTubeVideo from '@/components/YouTubeVideo'
import { SectionHeader, Card, CTABlock } from '@/components/SectionComponents'
import { Reveal, RevealStagger, RevealItem, TiltCard, Parallax } from '@/components/Motion'
import { PiBuildingsDuotone, PiTrophyDuotone, PiShoppingBagDuotone, PiTruckDuotone, PiLeafDuotone, PiUsersDuotone, PiMapPinDuotone, PiPhoneDuotone, PiEnvelopeDuotone, PiArrowRightDuotone } from 'react-icons/pi'
import { subsidiaryImage, sectorImage, newsImage } from '@/lib/images'
import { settingValue, settingRow } from '@/lib/settingsUtils'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const tagline = settings?.tagline || 'Affordable, convenient and nutritious cereal staple foods'
  const description = settingValue(
    settings,
    'home_meta_description',
    'Yedent Agro Group of Companies - Producing affordable, convenient and nutritious cereal staple foods, animal feed and poultry products in Ghana.'
  )

  return {
    title: `${orgName} | ${tagline}`,
    description,
    openGraph: {
      title: `${orgName} | ${tagline}`,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default async function Home() {
  const [
    settings,
    heroSlides,
    subsidiaries,
    products,
    awards,
    news
  ] = await Promise.all([
    getSettings(),
    getHeroSlides(),
    getSubsidiaries(),
    getProducts({ sector: 'consumer' }),
    getAwards(),
    getNewsEvents({ limit: '3' })
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'
  const tagline = settings?.tagline || 'Affordable, convenient and nutritious cereal staple foods'
  const description = settings?.about_summary || 'Yedent Agro Group of Companies is a wholly Ghanaian owned limited liability company founded in 2004, operating across the entire cereal, legumes and poultry value chain.'
  const phonePrimary = settings?.phone_primary || '+233 (0)20 816 6021'
  const email = settings?.email || 'info@yedentghana.com'
  const address = settings?.head_office_address || 'P.O. Box 1306, Sunyani – Bono Region, Ghana'
  const homepageVideoUrl = settings?.homepage_video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

  const homeValues = settingRow(settings, 'home_values', [
    { label: 'Quality', heading: 'Fortified Standards', body: 'All consumer foods fortified with 18+ vitamins and minerals meeting WHO/FAO guidelines.' },
    { label: 'Community', heading: 'Social Impact', body: 'Supporting base-of-pyramid populations with affordable nutrition and CSR initiatives.' },
    { label: 'Reach', heading: 'Nationwide Distribution', body: 'Sales network covering Bono, Bono East, and Ashanti regions with dedicated representatives.' },
    { label: 'Integration', heading: 'Full Value Chain', body: 'From farm to fork — cereals, legumes, poultry feed, and consumer foods under one group.' },
  ])

  const homeStats = settingRow(settings, 'home_stats', [
    { value: '18+', label: 'Vitamins & Minerals' },
    { value: '2004', label: 'Founded' },
    { value: '3', label: 'Subsidiaries' },
    { value: '3', label: 'Regions Served' },
  ])

  // Featured consumer products for home page
  const featuredProducts = products.slice(0, 3)

  // Latest awards for home page
  const latestAwards = awards.slice(0, 3)

  return (
    <>
      {/* Hero - Full-screen video with 4-slide text/CTA carousel (company + subsidiaries) */}
      <HeroCarousel initialSlides={heroSlides} />

      {/* Subsidiaries Overview */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker={settingValue(settings, 'home_subs_kicker', 'Our Group')}
              heading={settingValue(settings, 'home_subs_heading', 'Three subsidiaries, one mission')}
              description={settingValue(settings, 'home_subs_description', 'Yedent Agro operates through three specialized subsidiaries, each focused on a critical segment of the agricultural value chain.')}
            />
          </Reveal>
          <RevealStagger className="grid md:grid-cols-3 gap-6">
            {subsidiaries.map((sub: { id: string; slug: string; name: string; focus_area: string; description: string }) => (
              <RevealItem key={sub.id} direction="up">
                <TiltCard>
                  <Link
                    href={`/about/subsidiaries/${sub.slug}`}
                    className="card-premium overflow-hidden h-full group block"
                  >
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
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <Reveal>
            <SectionHeader
              kicker={settingValue(settings, 'home_prod_kicker', 'Featured Products')}
              heading={settingValue(settings, 'home_prod_heading', 'Fortified nutrition for every table')}
              description={settingValue(settings, 'home_prod_description', 'Our consumer food products are fortified with essential vitamins and minerals to combat malnutrition.')}
            />
          </Reveal>
          <RevealStagger className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product: { id: string; slug: string; name: string; sector: string; description: string; fda_registration: string | null }) => (
              <RevealItem key={product.id} direction="up">
                <TiltCard className="h-full">
                  <Link href={`/products/${product.slug}`} className="block h-full group">
                    <Card className="h-full">
                      <div className="relative aspect-[4/3] overflow-hidden mb-6">
                        <Image
                          src={sectorImage(product.sector)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.fda_registration && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-dark rounded">
                            {product.fda_registration}
                          </div>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-dark/45 font-medium mb-1">
                        {product.sector === 'consumer' ? 'Consumer Foods' : product.sector === 'industrial' ? 'Industrial Bulk' : 'Poultry Feed'}
                      </p>
                      <h3 className="text-2xl font-serif text-dark mb-2">{product.name}</h3>
                      <p className="text-dark/75 leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-4 transition-all">
                        <span>{settingValue(settings, 'home_view_details_label', 'View Details')}</span>
                        <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                      </div>
                    </Card>
                  </Link>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
          <Reveal className="mt-10 text-center">
            <Link href="/products" className="btn-secondary inline-flex group group-hover:gap-4">
              {settingValue(settings, 'home_prod_cta', 'View All Products')}
              <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Awards — dark green */}
      <section className="section-padding bg-[#233F2E] relative overflow-hidden">
        <Parallax from={-40} to={40} className="absolute top-20 -left-24 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <Parallax from={60} to={-40} className="absolute -bottom-16 -right-20 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium relative">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <span className="kicker-light mb-6">{settingValue(settings, 'home_awards_kicker', 'Recognition')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-cream leading-[1.05] max-w-2xl">
                  {settingValue(settings, 'home_awards_heading', 'Awarded for excellence')}
                </h2>
              </div>
              <p className="text-cream/70 leading-relaxed max-w-sm text-lg lg:text-right">
                {settingValue(settings, 'home_awards_description', 'Our commitment to quality and social impact has been recognized by industry leaders and government bodies.')}
              </p>
            </div>
          </Reveal>
          <RevealStagger className="grid md:grid-cols-3 gap-6">
            {latestAwards.map((award: { id: string; title: string; conferring_body: string; award_year: number }) => (
              <RevealItem key={award.id} direction="up">
                <div className="bg-white/5 border border-white/15 p-8 text-center backdrop-blur-sm hover:border-lime hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-lg bg-lime/20 flex items-center justify-center text-lime group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    <PiTrophyDuotone className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-serif text-cream mb-3 leading-snug">{award.title}</h3>
                  <p className="text-cream/55 text-sm">{award.conferring_body} — {award.award_year}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
          <Reveal className="mt-10 text-center">
            <Link href="/about/awards" className="btn-lime inline-flex group hover:gap-4">
              {settingValue(settings, 'home_awards_cta', 'View All Awards')}
              <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* News & Events — white with featured layout */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <Reveal>
            <SectionHeader
              kicker={settingValue(settings, 'home_news_kicker', 'Latest News')}
              heading={settingValue(settings, 'home_news_heading', 'Stay updated with Yedent')}
              description={settingValue(settings, 'home_news_description', 'Follow our journey as we expand our impact across Ghana and beyond.')}
            />
          </Reveal>
          {news[0] && (
            <Reveal direction="left">
              <Link
                href={`/news/${news[0].slug}`}
                className="card-premium overflow-hidden mb-6 group flex flex-col md:flex-row"
              >
                <div className="relative md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
                  <Image src={newsImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <span className="pill-tag mb-4 self-start">{news[0].type === 'news' ? 'News' : 'Event'}</span>
                  <h3 className="text-2xl md:text-3xl font-serif text-dark mb-3 leading-snug">{news[0].title}</h3>
                  <p className="text-dark/70 leading-relaxed mb-6">{news[0].summary}</p>
                  <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-4 transition-all">
                    <span>{settingValue(settings, 'home_readmore_label', 'Read More')}</span>
                    <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 group-hover:text-lime transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          )}
          <RevealStagger className="grid md:grid-cols-2 gap-6">
            {news.slice(1).map((item: { id: string; slug: string; type: string; title: string; summary: string | null }) => (
              <RevealItem key={item.id} direction="up">
                <Link href={`/news/${item.slug}`} className="card-premium overflow-hidden group flex gap-5 p-0 h-full">
                  <div className="relative w-36 shrink-0 min-h-full overflow-hidden">
                    <Image src={newsImage} alt="" fill sizes="144px" className="object-cover group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <div className="py-5 pr-5 flex flex-col justify-center">
                    <span className="text-xs uppercase tracking-[0.2em] text-lime font-medium mb-2 block">{item.type === 'news' ? 'News' : 'Event'}</span>
                    <h3 className="text-lg font-serif text-dark mb-2 leading-snug line-clamp-2">{item.title}</h3>
                    <p className="text-dark/75 text-sm leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
          <Reveal className="mt-10 text-center">
            <Link href="/news" className="btn-secondary inline-flex group hover:gap-4">
              {settingValue(settings, 'home_news_cta', 'All News & Events')}
              <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Yedent / Value Props — dark green */}
      <section className="section-padding bg-[#233F2E] relative overflow-hidden">
        <Parallax from={-60} to={50} className="absolute -top-20 -right-20 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
        <Parallax from={50} to={-60} className="absolute -bottom-24 -left-24 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
              <div>
                <span className="kicker-light mb-6">{settingValue(settings, 'home_why_kicker', 'Why Yedent')}</span>
                <h2 className="text-4xl md:text-5xl font-serif text-cream leading-[1.05] max-w-2xl">
                  {settingValue(settings, 'home_why_heading', 'Built on values, driven by impact')}
                </h2>
              </div>
              <p className="text-cream/70 leading-relaxed max-w-sm text-lg lg:text-right">
                {settingValue(settings, 'home_why_description', 'Our operations are guided by principles that put people and planet first.')}
              </p>
            </div>
          </Reveal>
          <RevealStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeValues.map((value, i) => {
              const Icons = [PiLeafDuotone, PiUsersDuotone, PiTruckDuotone, PiBuildingsDuotone]
              const Icon = Icons[i % Icons.length]
              return (
                <RevealItem key={i} direction="up">
                  <div className="bg-white/5 border border-white/15 p-7 h-full backdrop-blur-sm hover:border-lime hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center mb-5 text-lime group-hover:scale-110 group-hover:bg-lime/30 transition-all duration-300">
                      <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-lime font-medium mb-3 block">{value.label}</span>
                    <h3 className="text-2xl font-serif text-cream mb-3">{value.heading}</h3>
                    <p className="text-cream/70 leading-relaxed">{value.body}</p>
                  </div>
                </RevealItem>
              )
            })}
          </RevealStagger>
          <RevealStagger className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/15 pt-10 text-center">
            {homeStats.map((stat, i) => (
              <RevealItem key={i} direction="none">
                <div className="text-4xl md:text-5xl font-serif text-lime mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-cream/60">{stat.label}</div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* YouTube Video Section (above footer) */}
      <section className="py-16 bg-white border-y border-dark/10">
        <div className="container-premium">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="kicker mb-4 justify-center">{settingValue(settings, 'home_video_kicker', 'Watch Our Story')}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-4">
                {settingValue(settings, 'home_video_heading', 'See Yedent Agro in Action')}
              </h2>
              <p className="text-dark/75 text-lg leading-relaxed">
                {settingValue(settings, 'home_video_description', 'Watch our corporate video to learn more about our operations, impact, and vision for the future of agriculture in Ghana.')}
              </p>
            </div>
          </Reveal>
          <Reveal direction="none" className="max-w-4xl mx-auto">
            <YouTubeVideo
              videoUrl={homepageVideoUrl}
              title={settingValue(settings, 'home_video_title', 'Yedent Agro Group - Corporate Video')}
              className="rounded-lg"
            />
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream overflow-hidden">
        <div className="container-premium">
          <Reveal direction="none">
            <CTABlock />
          </Reveal>
        </div>
      </section>
    </>
  )
}