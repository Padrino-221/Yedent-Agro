import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getSettings, getNewsEvents } from '@/lib/api'
import YouTubeVideo from '@/components/YouTubeVideo'
import { PiCalendarDuotone, PiClockDuotone, PiArrowLeftDuotone, PiNewspaperDuotone } from 'react-icons/pi'
import { newsImage } from '@/lib/images'
import { SectionOrbs } from '@/components/ImpactBand'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const news = await getNewsEvents()
  const item = news.find((n) => n.slug === slug)

  if (!item) return { title: 'Not Found' }

  return {
    title: item.title,
    description: item.summary || undefined,
    openGraph: {
      title: `${item.title} | ${orgName}`,
      description: item.summary || undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, news] = await Promise.all([
    getSettings(),
    getNewsEvents()
  ])

  const item = news.find((n) => n.slug === slug)
  if (!item) notFound()

  const orgName = settings?.company_name || 'Yedent Agro Group'

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium max-w-4xl relative">
          <Link href="/news" className="flex w-fit items-center gap-2 text-dark/60 hover:text-dark mb-8 transition-colors">
            <PiArrowLeftDuotone className="w-4 h-4" />
            Back to News & Events
          </Link>

          <div className="mb-8">
            <span className="kicker mb-4">{item.type === 'event' ? 'Upcoming Events' : 'Latest News'}</span>
            <div className="flex items-center gap-2 text-xs text-lime font-medium mb-4">
              {item.type === 'event' ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/20 rounded">
                  <PiCalendarDuotone className="w-3 h-3" />
                  Event
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-lime/20 rounded">
                  <PiNewspaperDuotone className="w-3 h-3" />
                  News
                </span>
              )}
              {(item.published_at || item.event_date) && (
                <span className="inline-flex items-center gap-1 text-dark/75">
                  <PiClockDuotone className="w-3 h-3" />
                  {new Date(item.event_date || item.published_at || '').toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">{item.title}</h1>
            {item.summary && <p className="text-dark/75 text-lg leading-relaxed mb-6">{item.summary}</p>}
          </div>

          <div className="relative aspect-[16/9] overflow-hidden border-4 border-cream bg-white mb-8">
            <Image src={newsImage} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
          </div>

          {item.body && (
            <div className="prose prose-lg max-w-none mx-auto text-dark/70 leading-relaxed space-y-4">
              {item.body.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {item.video_url && (
            <div className="mx-auto mt-12">
              <YouTubeVideo videoUrl={item.video_url} title={item.title} />
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/news" className="btn-secondary inline-flex group">
              <PiArrowLeftDuotone className="w-4 h-4" />
              More News & Events
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}