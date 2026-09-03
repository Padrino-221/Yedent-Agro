import type { Metadata } from 'next'
import { getSettings, getAwards } from '@/lib/api'
import { SectionHeader, Card } from '@/components/SectionComponents'
import { PiTrophyDuotone, PiArrowRightDuotone } from 'react-icons/pi'
import { settingValue } from '@/lib/settingsUtils'
import { ImpactBand, SectionOrbs } from '@/components/ImpactBand'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.company_name || 'Yedent Agro Group'
  const description = settingValue(
    settings,
    'awards_meta_description',
    'Yedent Agro Group has been recognized for excellence in agriculture, tax compliance, and social impact.'
  )

  return {
    title: 'Awards & Recognition',
    description,
    openGraph: {
      title: `Awards & Recognition | ${orgName}`,
      description,
    },
  }
}

export default async function AwardsPage() {
  const [settings, awards] = await Promise.all([
    getSettings(),
    getAwards()
  ])

  const orgName = settings?.company_name || 'Yedent Agro Group'

  return (
    <>
      <section className="section-padding bg-cream relative overflow-hidden">
        <SectionOrbs />
        <div className="container-premium relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="kicker mb-6 justify-center">{settingValue(settings, 'awards_hero_kicker', 'Recognition')}</span>
            <h1 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05] mb-6">
              {settingValue(settings, 'awards_hero_heading', 'Awarded for excellence')}
            </h1>
            <p className="text-dark/75 text-lg leading-relaxed">
              {settingValue(settings, 'awards_hero_description', 'Our commitment to quality, innovation, and social impact has been recognized by industry leaders, government bodies, and international organizations.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <Card key={award.id} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-5 rounded-lg bg-lime/20 flex items-center justify-center text-lime group-hover:bg-lime group-hover:text-dark transition-all">
                  <PiTrophyDuotone className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-serif text-dark mb-2">{award.title}</h3>
                <p className="text-dark/75 text-sm mb-1">{award.conferring_body}</p>
                <p className="text-dark/45 text-sm font-medium">{award.award_year}</p>
                {award.description && <p className="mt-4 text-dark/75 text-sm">{award.description}</p>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ImpactBand
        kicker="Recognition Built on Trust"
        heading="Excellence our partners keep rewarding"
        body="Awards from industry leaders, government bodies and international organisations reflect the quality, compliance and community impact woven into everything we do."
      />

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeader
            kicker={settingValue(settings, 'awards_timeline_kicker', 'Timeline')}
            heading={settingValue(settings, 'awards_timeline_heading', 'Our journey of recognition')}
            description={settingValue(settings, 'awards_timeline_description', 'Key milestones in our pursuit of excellence.')}
          />
          <div className="max-w-2xl mx-auto">
            {awards
              .sort((a, b) => b.award_year - a.award_year)
              .map((award, index) => (
                <div key={award.id} className="relative pl-8 pb-10 border-l-2 border-dark/10 last:border-0">
                  <div className="absolute left-0 top-1 w-4 h-4 bg-lime rounded-full border-2 border-cream" />
                  <div className="text-sm text-dark/45 font-medium mb-1">{award.award_year}</div>
                  <h3 className="text-xl font-serif text-dark mb-1">{award.title}</h3>
                  <p className="text-dark/75">{award.conferring_body}</p>
                  {award.description && <p className="mt-2 text-dark/75 text-sm">{award.description}</p>}
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
