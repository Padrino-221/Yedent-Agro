import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLeader, getSettings } from '@/lib/api'
import { PiArrowLeftDuotone } from 'react-icons/pi'
import { SectionOrbs } from '@/components/ImpactBand'
import { settingValue } from '@/lib/settingsUtils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const [settings, leader] = await Promise.all([getSettings(), getLeader(id)])
    const orgName = settings?.company_name || 'Yedent Agro Group'
    const title = leader ? `${leader.name} · ${leader.position}` : 'Leadership'
    return {
      title,
      description: leader?.bio?.slice(0, 160) || undefined,
      openGraph: {
        title: `${title} | ${orgName}`,
        description: leader?.bio?.slice(0, 160) || undefined,
        images: leader?.image_url ? [{ url: leader.image_url }] : undefined,
      },
    }
  } catch {
    return { title: 'Leadership' }
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function LeaderProfilePage({ params }: Props) {
  const { id } = await params

  let leader: Awaited<ReturnType<typeof getLeader>> | null = null
  try {
    leader = await getLeader(id)
  } catch {
    // handled below
  }
  if (!leader) notFound()

  const settings = await getSettings()

  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      <SectionOrbs />
      <div className="container-premium max-w-5xl relative">
        <Link href="/departments" className="flex w-fit items-center gap-2 text-dark/60 hover:text-dark mb-10 transition-colors">
          <PiArrowLeftDuotone className="w-4 h-4" />
          Back to Leadership
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-14 items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-lime-100/70 border border-dark/10">
            {leader.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={leader.image_url} alt={leader.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-6xl text-lime-800">{initials(leader.name)}</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-lime-700 text-xs font-bold uppercase tracking-[0.18em] mb-4">{leader.position}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-8">{leader.name}</h1>
            {leader.bio ? (
              <div className="space-y-4">
                {leader.bio.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i} className="text-dark/75 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-dark/75 text-lg leading-relaxed">
                {settingValue(settings, 'departments_leader_bio_fallback', 'Profile details coming soon.')}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}