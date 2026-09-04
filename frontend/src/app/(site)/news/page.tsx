import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings, getNewsEvents } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiNewspaperDuotone, PiCalendarDuotone, PiArrowRightDuotone, PiClockDuotone } from 'react-icons/pi'
import { newsImage } from '@/lib/images'
import { settingValue } from '@/lib/settingsUtils'
import { ImpactBand, SectionOrbs } from '@/components/ImpactBand'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'news_meta_description',
    'Stay updated with the latest news, events, and announcements from Yedent Agro Group.'
  )

  return {
    title: 'News & Events',
    description,
    openGraph: {
      title: `News & Events | ${orgName}`,
      description,
    },
  }
}

export default async function NewsPage() {
  const [settings, news] = await Promise.all([
    getSettings(),
    getNewsEvents()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  const newsItems = news.filter((n) => n.type === 'news')
  const eventItems = news.filter((n) => n.type === 'event')

  return (
    <>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10 bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'news_hero_kicker', 'Stay Informed')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'news_hero_heading', 'News & Events')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'news_hero_description', 'Follow our journey as we expand our impact across Ghana and beyond. From industry awards to community initiatives, stay connected with Yedent Agro.')}
            </p>
          </div>
        </div>
      </section>

      <ImpactBand
        kicker="Across Ghana & Beyond"
        heading="Progress worth sharing"
        body="From industry awards to community initiatives, we keep you connected to the milestones shaping Yedent and the communities we serve."
      />

      {/* News */}
      {newsItems.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'news_news_kicker', 'Latest News')}
              heading={settingValue(settings, 'news_news_heading', 'Company News & Announcements')}
              description={settingValue(settings, 'news_news_description', 'Official announcements, product launches, and corporate updates.')}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
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
                  <PiNewspaperDuotone className="w-3 h-3" />
                  News
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

      {/* Events */}
      {eventItems.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-premium">
            <SectionHeader
              kicker={settingValue(settings, 'news_events_kicker', 'Upcoming Events')}
              heading={settingValue(settings, 'news_events_heading', 'Events & Exhibitions')}
              description={settingValue(settings, 'news_events_description', 'Join us at industry events, agricultural shows, and community initiatives.')}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventItems.map((item) => (
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
                      <PiCalendarDuotone className="w-3 h-3" />
                      Event
                    </div>
                    {item.event_date && (
                      <div className="flex items-center gap-2 text-xs text-dark/75 mb-2">
                        <PiClockDuotone className="w-3 h-3" />
                        {new Date(item.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    <h3 className="text-lg font-serif text-dark mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-dark/75 text-sm leading-relaxed mb-4 line-clamp-2">{item.summary}</p>
                    <div className="flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>{settingValue(settings, 'news_viewdetails_label', 'View Details')}</span>
                      <PiArrowRightDuotone className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {newsItems.length === 0 && eventItems.length === 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium text-center py-16">
            <PiNewspaperDuotone className="w-16 h-16 mx-auto mb-4 text-lime/30" />
            <h2 className="text-2xl font-serif text-dark mb-2">{settingValue(settings, 'news_empty_heading', 'No news or events yet')}</h2>
            <p className="text-dark/75">{settingValue(settings, 'news_empty_body', 'Check back soon for updates from Yedent Agro Group.')}</p>
          </div>
        </section>
      )}
    </>
  )
}